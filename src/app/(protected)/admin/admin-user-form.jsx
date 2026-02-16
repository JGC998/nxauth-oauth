'use client';

import { useActionState } from 'react';
import { adminCreateUser } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminUserForm() {
    const [state, action, isPending] = useActionState(adminCreateUser, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            // Reset form logic if needed, usually controlled inputs or ref
            document.getElementById('create-user-form').reset();
        }
    }, [state, router]);

    return (
        <form id="create-user-form" action={action} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input name="name" type="text" required placeholder="Nombre completo" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" required placeholder="usuario@email.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input name="password" type="password" required placeholder="••••••••" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select name="role" className="w-full border rounded px-3 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 transition shadow-sm">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            </div>

            {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
            {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary w-full mt-2"
            >
                {isPending ? 'Creando...' : 'Crear Usuario'}
            </button>
        </form>
    );
}
