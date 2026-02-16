import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
    const session = await auth();

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-20"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in relative z-10 p-8 rounded-3xl bg-white/60 border border-white/60 backdrop-blur-xl shadow-2xl">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 border border-white/60 shadow-sm text-sm font-semibold text-slate-700 mb-4 animate-slide-up">
                    🚀 Sistema de Autenticación Moderno
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-sm text-slate-900">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary pb-1 block">
                        Autenticación Next.js
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-700 font-normal max-w-2xl mx-auto leading-relaxed">
                    Sistema seguro y moderno con <span className="font-bold text-primary">OAuth</span>, <span className="font-bold text-secondary">Credenciales</span> y gestión de roles lista para producción.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    {session ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="btn-primary text-lg px-8 py-3 h-auto"
                            >
                                Ir al Dashboard
                            </Link>
                            {session.user.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className="px-8 py-3 rounded-lg bg-white border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
                                >
                                    Panel Admin
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="group relative px-8 py-3 rounded-lg bg-white overflow-hidden shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Iniciar Sesión</span>
                            </Link>
                            <Link
                                href="/auth/registro"
                                className="btn-primary text-lg px-8 py-3 h-auto"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black"></div>Next.js 15+</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div>Auth.js v5</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary"></div>Prisma</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent"></div>Tailwind CSS</span>
                </div>
            </div>

        </div>
    );
}
