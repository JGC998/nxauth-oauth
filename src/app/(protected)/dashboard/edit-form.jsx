'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/lib/actions';

export default function EditProfileForm({ user }) {
    const [state, action, isPending] = useActionState(updateProfile, undefined);

    return (
        <form action={action} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                    type="text"
                    name="name"
                    defaultValue={user.name}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
            </div>

            {state?.success && (
                <p className="text-green-600 text-sm">✅ {state.message}</p>
            )}
            {state?.error && (
                <p className="text-red-600 text-sm">❌ {state.error}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
        </form>
    );
}
