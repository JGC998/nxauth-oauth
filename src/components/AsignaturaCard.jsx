import Link from "next/link";

export default function AsignaturaCard({ asignatura }) {
    return (
        <Link href={`/asignaturas/${asignatura.id}`}>
            <div className="glass-card rounded-xl p-6 border border-white/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">
                            {asignatura.nombre}
                        </h3>
                        {asignatura.profesor && (
                            <p className="text-sm text-slate-500 mt-1">
                                <span className="font-medium">👨‍🏫 Profesor:</span> {asignatura.profesor}
                            </p>
                        )}
                    </div>
                    <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">
                        {asignatura.horas_semana}h/semana
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {asignatura._count?.estudiantes || 0} estudiantes matriculados
                    </div>
                </div>
            </div>
        </Link>
    );
}
