import { ReactNode } from "react";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  if (userId) redirect("/");

  return (
    <main className="relative min-h-screen grid lg:grid-cols-2 bg-light-800 overflow-hidden">
      {/* Background image for mobile */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/bg.jpg"
          alt="auth background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/30 to-black/30 mix-blend-multiply" />
      </div>
      {/* Left: Auth form card */}
      <section className="relative z-10 flex items-center justify-center px-6 py-10 lg:px-12">
        <div className="w-full max-w-md rounded-xl border border-white/20 bg-card/30 backdrop-blur-md bg-clip-padding shadow-2xl p-6 sm:p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Kazi Mtaani</h1>
              <p className="text-sm text-white/80">Digital Workforce Management</p>
            </div>
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </section>

      {/* Right: Illustration with brand overlay */}
      <section className="relative hidden lg:block">
        <Image
          src="/bg.jpg"
          alt="auth illustration"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/30 to-black/30 mix-blend-multiply" />
        <div className="absolute bottom-8 left-8 text-white drop-shadow">
          <h2 className="font-bebas-neue text-4xl tracking-wider">Welcome to Kazi Mtaani</h2>
          <p className="text-sm opacity-90">Sign in to access your dashboard</p>
        </div>
      </section>
    </main>
  );
};

export default Layout;
