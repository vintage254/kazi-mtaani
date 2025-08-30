import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, getUserByClerkId, updateUser } from '@/lib/db/user-actions'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type

  if (eventType === 'user.created') {
    try {
      const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = evt.data

      // Extract primary email and phone
      const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address || ''
      const primaryPhone = phone_numbers?.find(phone => phone.id === evt.data.primary_phone_number_id)?.phone_number || ''

      // Create user in database with Google OAuth data
      await createUser({
        clerkId: id,
        email: primaryEmail,
        firstName: first_name || '',
        lastName: last_name || '',
        role: 'worker', // Default role, can be changed later
        phone: primaryPhone,
        profileImage: image_url || null
      })

      console.log(`User created: ${id}`)
    } catch (error) {
      console.error('Error creating user in database:', error)
      return new Response('Error creating user', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    try {
      const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = evt.data

      // Check if user exists in our database
      const existingUser = await getUserByClerkId(id)
      if (existingUser) {
        // Extract primary email and phone
        const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address || existingUser.email
        const primaryPhone = phone_numbers?.find(phone => phone.id === evt.data.primary_phone_number_id)?.phone_number || existingUser.phone

        // Update user in database
        await updateUser(existingUser.id, {
          email: primaryEmail,
          firstName: first_name || existingUser.firstName,
          lastName: last_name || existingUser.lastName,
          phone: primaryPhone,
          profileImage: image_url || existingUser.profileImage
        })

        console.log(`User updated: ${id}`)
      }
    } catch (error) {
      console.error('Error updating user in database:', error)
      return new Response('Error updating user', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}
