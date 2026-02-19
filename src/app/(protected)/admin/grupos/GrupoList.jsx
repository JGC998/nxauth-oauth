'use client';

import { useActionState } from 'react';
import { adminDeleteGrupo } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DeleteButton({ grupoId }) {
    const [state, action, isPending] = useActionState(adminDeleteGrupo, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
        }
    }, [state, router]);

    const handleSubmit = (e) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.")) {
            e.preventDefault();
        }
    }

    return (
        <form action={action} onSubmit={handleSubmit}>
            <input type="hidden" name="grupoId" value={grupoId} />
            <button
                type="submit"
                disabled={isPending}
                className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition disabled:opacity-50 flex items-center gap-1"
            >
                {isPending ? (
                    <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                        </svg>
                        Eliminar
                    </>
                )}
            </button>
        </form>
    )
}

export default function GrupoList({ grupos }) {
    if (!grupos || grupos.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No hay grupos registrados aún.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aula</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {grupos.map((grupo) => (
                        <tr key={grupo.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{grupo.nombre}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{grupo.tutor}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{grupo.aula}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <DeleteButton grupoId={grupo.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
