// Face recognition utility using @vladmandic/human loaded from CDN
// This runs entirely in the browser - no server-side usage

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let humanInstance: any = null
let loadingPromise: Promise<void> | null = null

const HUMAN_CDN = 'https://cdn.jsdelivr.net/npm/@vladmandic/human@3.3.6/dist/human.esm.js'

const humanConfig = {
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human@3.3.6/models/',
  backend: 'webgl' as const,
  face: {
    enabled: true,
    detector: { enabled: true, maxDetected: 1, rotation: false },
    mesh: { enabled: false },
    iris: { enabled: false },
    description: { enabled: true }, // 128-dim face descriptor
    emotion: { enabled: false },
    antispoof: { enabled: true }, // liveness detection
    liveness: { enabled: true },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
}

export async function loadHuman(): Promise<void> {
  if (humanInstance) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      const module = await import(/* webpackIgnore: true */ HUMAN_CDN)
      const Human = module.default || module.Human
      humanInstance = new Human(humanConfig)
      await humanInstance.warmup()
    } catch (error) {
      loadingPromise = null
      throw error
    }
  })()

  return loadingPromise
}

export interface FaceDetectionResult {
  descriptor: number[] // 128-dim face embedding
  confidence: number   // detection confidence 0-1
  isReal: number       // anti-spoof score 0-1
  box: [number, number, number, number] // x, y, width, height
}

export async function detectFace(
  videoElement: HTMLVideoElement
): Promise<FaceDetectionResult | null> {
  if (!humanInstance) {
    await loadHuman()
  }

  const result = await humanInstance.detect(videoElement)

  if (!result.face || result.face.length === 0) {
    return null
  }

  const face = result.face[0]

  if (!face.embedding || face.embedding.length === 0) {
    return null
  }

  return {
    descriptor: Array.from(face.embedding),
    confidence: face.faceScore || face.boxScore || 0,
    isReal: face.real ?? 1,
    box: face.box || [0, 0, 0, 0],
  }
}

// Cosine similarity between two face descriptors (client-side preview only)
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function isHumanLoaded(): boolean {
  return humanInstance !== null
}
