'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(register, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/auth/login');
        }
    }, [state, router]);

    return (
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-gray-50 animate-fade-in">
            <div className="card w-full max-w-md p-8 bg-white">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Crear una cuenta</h2>
                    <p className="text-gray-500 mt-2">Únete a nosotros en segundos</p>
                </div>

                <form action={action} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Ej. Juan Pérez"
                            required
                        />
                        {state?.error?.name && <p className="text-red-500 text-xs mt-1">{state.error.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="tu@email.com"
                            required
                        />
                        {state?.error?.email && <p className="text-red-500 text-xs mt-1">{state.error.email}</p>}
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
                        {state?.error?.password && <p className="text-red-500 text-xs mt-1">{state.error.password}</p>}
                    </div>

                    {typeof state?.error === 'string' && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn w-full bg-green-600 hover:bg-green-700 text-white shadow-md disabled:opacity-70"
                    >
                        {isPending ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta? <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}
