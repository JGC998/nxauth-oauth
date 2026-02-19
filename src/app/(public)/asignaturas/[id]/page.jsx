import Link from "next/link";
import EstudianteCard from "@/components/EstudianteCard";

async function getAsignatura(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/asignaturas/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Asignatura no encontrada');
    }

    return res.json();
}

export default async function AsignaturaDetailPage({ params }) {
    const { id } = await params;
    const asignatura = await getAsignatura(id);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-slate-500">
                <Link href="/asignaturas" className="hover:text-primary transition-colors">
                    Asignaturas
                </Link>
                <span className="mx-2">/</span>
                <span className="text-slate-800 font-medium">{asignatura.nombre}</span>
            </div>

            {/* Header */}
            <div className="glass-card rounded-2xl p-8 border border-white/40">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                            {asignatura.nombre}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {asignatura.profesor && (
                                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Profesor</p>
                                    <p className="font-semibold text-slate-900 text-lg">👨‍🏫 {asignatura.profesor}</p>
                                </div>
                            )}

                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Horas Semanales</p>
                                <p className="font-semibold text-slate-900 text-lg">{asignatura.horas_semana} horas</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/10 text-accent px-6 py-3 rounded-full text-lg font-bold">
                        {asignatura.estudiantes.length} estudiantes
                    </div>
                </div>
            </div>

            {/* Enrolled Students */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Estudiantes Matriculados
                </h2>

                {asignatura.estudiantes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {asignatura.estudiantes.map((estudiante) => (
                            <EstudianteCard key={estudiante.id} estudiante={estudiante} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-xl p-12 text-center border border-white/40">
                        <p className="text-slate-400 text-lg">No hay estudiantes matriculados en esta asignatura</p>
                    </div>
                )}
            </div>
        </div>
    );
}
