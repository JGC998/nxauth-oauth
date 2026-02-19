'use client';

import { useActionState } from 'react';
import { adminCreateGrupo } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GrupoForm() {
    const [state, action, isPending] = useActionState(adminCreateGrupo, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            document.getElementById('create-grupo-form').reset();
        }
    }, [state, router]);

    return (
        <form id="create-grupo-form" action={action} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Grupo</label>
                <input name="nombre" type="text" required placeholder="Ej: 2º DAW" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tutor</label>
                <input name="tutor" type="text" required placeholder="Nombre del tutor" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
                <input name="aula" type="text" required placeholder="Ej: A-201" />
            </div>

            {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
            {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary w-full mt-2"
            >
                {isPending ? 'Creando...' : 'Crear Grupo'}
            </button>
        </form>
    );
}
