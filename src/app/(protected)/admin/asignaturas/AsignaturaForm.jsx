'use client';

import { useActionState } from 'react';
import { adminCreateAsignatura } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AsignaturaForm() {
    const [state, action, isPending] = useActionState(adminCreateAsignatura, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            document.getElementById('create-asignatura-form').reset();
        }
    }, [state, router]);

    return (
        <form id="create-asignatura-form" action={action} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Asignatura</label>
                <input name="nombre" type="text" required placeholder="Ej: Matemáticas" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profesor (opcional)</label>
                <input name="profesor" type="text" placeholder="Nombre del profesor" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horas por Semana</label>
                <input name="horas_semana" type="number" required min="1" placeholder="Ej: 4" />
            </div>

            {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
            {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary w-full mt-2"
            >
                {isPending ? 'Creando...' : 'Crear Asignatura'}
            </button>
        </form>
    );
}
