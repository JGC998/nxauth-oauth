import EstudianteCard from "@/components/EstudianteCard";
import Link from "next/link";

async function getGrupo(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/grupos/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Grupo no encontrado');
    }

    return res.json();
}

export default async function GrupoDetailPage({ params }) {
    const { id } = await params;
    const grupo = await getGrupo(id);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-slate-500">
                <Link href="/grupos" className="hover:text-primary transition-colors">
                    Grupos
                </Link>
                <span className="mx-2">/</span>
                <span className="text-slate-800 font-medium">{grupo.nombre}</span>
            </div>

            {/* Header */}
            <div className="glass-card rounded-2xl p-8 border border-white/40">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            {grupo.nombre}
                        </h1>
                        <div className="mt-4 space-y-2">
                            <p className="text-slate-600">
                                <span className="font-semibold">👤 Tutor:</span> {grupo.tutor}
                            </p>
                            <p className="text-slate-600">
                                <span className="font-semibold">🏫 Aula:</span> {grupo.aula}
                            </p>
                        </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-6 py-3 rounded-full text-lg font-bold">
                        {grupo.estudiantes.length} estudiantes
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Estudiantes del Grupo
                </h2>

                {grupo.estudiantes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grupo.estudiantes.map((estudiante) => (
                            <EstudianteCard key={estudiante.id} estudiante={estudiante} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-xl p-12 text-center border border-white/40">
                        <p className="text-slate-400 text-lg">No hay estudiantes en este grupo</p>
                    </div>
                )}
            </div>
        </div>
    );
}
