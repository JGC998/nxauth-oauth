import Link from 'next/link'
import { auth } from "@/auth"
import { signOut } from "@/auth"
import NavLinks from './nav-links'

async function Header() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/20 glass">
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 h-16">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hover:opacity-80 transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#logo-gradient)" className="w-8 h-8">
                            <defs>
                                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--primary)" />
                                    <stop offset="100%" stopColor="var(--secondary)" />
                                </linearGradient>
                            </defs>
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                        </svg>
                        NextAuth
                    </Link>
                    <NavLinks role={session?.user?.role} />
                </div>

                <nav className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-600 hidden sm:inline px-3 py-1 rounded-full bg-slate-100/50 border border-slate-200">{session.user.name}</span>
                            <form action={async () => {
                                'use server';
                                await signOut();
                            }}>
                                <button type="submit" className="text-sm font-medium text-red-500 hover:text-red-700 transition px-3 py-1.5 rounded-lg hover:bg-red-50">
                                    Salir
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary transition rounded-lg hover:bg-slate-50">
                                Iniciar Sesión
                            </Link>
                            <Link href="/auth/registro" className="btn-primary">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
