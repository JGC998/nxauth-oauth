import Link from "next/link";

async function getEstudiante(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/estudiantes/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Estudiante no encontrado');
    }

    return res.json();
}

export default async function EstudianteDetailPage({ params }) {
    const { id } = await params;
    const estudiante = await getEstudiante(id);

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-slate-500">
                <Link href="/estudiantes" className="hover:text-primary transition-colors">
                    Estudiantes
                </Link>
                <span className="mx-2">/</span>
                <span className="text-slate-800 font-medium">{estudiante.nombre}</span>
            </div>

            {/* Profile Header */}
            <div className="glass-card rounded-2xl p-8 border border-white/40">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {estudiante.foto ? (
                        <img
                            src={estudiante.foto}
                            alt={estudiante.nombre}
                            className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl font-bold text-white">
                            {estudiante.nombre?.charAt(0)}
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                            {estudiante.nombre}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Edad</p>
                                <p className="font-semibold text-slate-900 text-lg">
                                    {calcularEdad(estudiante.fecha_nacimiento)} años
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Nacido el {formatearFecha(estudiante.fecha_nacimiento)}
                                </p>
                            </div>

                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tutor Legal</p>
                                <p className="font-semibold text-slate-900 text-lg">{estudiante.tutor_legal}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grupo */}
            {estudiante.grupo && (
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Grupo Asignado</h2>
                    <Link href={`/grupos/${estudiante.grupo.id}`}>
                        <div className="glass-card rounded-xl p-6 border border-white/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                            <h3 className="text-xl font-bold text-primary mb-2">{estudiante.grupo.nombre}</h3>
                            <p className="text-slate-600">
                                <span className="font-medium">👤 Tutor:</span> {estudiante.grupo.tutor}
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">🏫 Aula:</span> {estudiante.grupo.aula}
                            </p>
                        </div>
                    </Link>
                </div>
            )}

            {/* Asignaturas */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Asignaturas Matriculadas ({estudiante.asignaturas.length})
                </h2>

                {estudiante.asignaturas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {estudiante.asignaturas.map((asignatura) => (
                            <Link key={asignatura.id} href={`/asignaturas/${asignatura.id}`}>
                                <div className="glass-card rounded-xl p-5 border border-white/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                    <h3 className="font-bold text-slate-800 text-lg mb-2">{asignatura.nombre}</h3>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        {asignatura.profesor && (
                                            <span>👨‍🏫 {asignatura.profesor}</span>
                                        )}
                                        <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-bold">
                                            {asignatura.horas_semana}h/sem
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-xl p-12 text-center border border-white/40">
                        <p className="text-slate-400 text-lg">No está matriculado en ninguna asignatura</p>
                    </div>
                )}
            </div>
        </div>
    );
}
