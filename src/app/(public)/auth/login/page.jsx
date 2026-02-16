'use client';

import { useActionState } from 'react';
import { authenticate, socialLogin } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [state, action, isPending] = useActionState(authenticate, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/dashboard');
            router.refresh();
        }
    }, [state, router]);

    return (
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-gray-50 animate-fade-in">
            <div className="card w-full max-w-md p-8 bg-white">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h2>
                    <p className="text-gray-500 mt-2">Ingresa tus credenciales para acceder</p>
                </div>

                <form action={action} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn btn-primary w-full shadow-md"
                    >
                        {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">O continúa con</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <form action={() => socialLogin('google')}>
                            <button type="submit" className="btn btn-secondary w-full justify-start relative pl-12">
                                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5 absolute left-4" />
                                <span className="w-full text-center">Google</span>
                            </button>
                        </form>
                        <form action={() => socialLogin('github')}>
                            <button type="submit" className="btn btn-secondary w-full justify-start relative pl-12">
                                <img src="https://authjs.dev/img/providers/github.svg" alt="GitHub" className="w-5 h-5 absolute left-4" />
                                <span className="w-full text-center">GitHub</span>
                            </button>
                        </form>
                        <form action={() => socialLogin('discord')}>
                            <button type="submit" className="btn btn-secondary w-full justify-start relative pl-12">
                                {/* Placeholder icon for Discord if not available, usually a svg from branding */}
                                <img src="https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord" className="w-5 h-5 absolute left-4" />
                                <span className="w-full text-center">Discord</span>
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    ¿No tienes cuenta? <Link href="/auth/registro" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Regístrate gratis</Link>
                </p>
            </div>
        </div>
    );
}
