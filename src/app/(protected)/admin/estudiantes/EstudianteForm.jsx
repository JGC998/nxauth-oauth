'use client';

import { useActionState } from 'react';
import { adminCreateEstudiante } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EstudianteForm({ grupos }) {
    const [state, action, isPending] = useActionState(adminCreateEstudiante, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            document.getElementById('create-estudiante-form').reset();
        }
    }, [state, router]);

    return (
        <form id="create-estudiante-form" action={action} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input name="nombre" type="text" required placeholder="Nombre completo del estudiante" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input name="fecha_nacimiento" type="date" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tutor Legal</label>
                <input name="tutor_legal" type="text" required placeholder="Nombre del tutor legal" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo (opcional)</label>
                <select name="grupoId" className="w-full border rounded px-3 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 transition shadow-sm">
                    <option value="">Sin grupo</option>
                    {grupos?.map((grupo) => (
                        <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>
                    ))}
                </select>
            </div>

            {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
            {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary w-full mt-2"
            >
                {isPending ? 'Creando...' : 'Crear Estudiante'}
            </button>
        </form>
    );
}
