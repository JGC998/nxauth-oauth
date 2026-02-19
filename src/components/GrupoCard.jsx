import Link from "next/link";

export default function GrupoCard({ grupo }) {
    return (
        <Link href={`/grupos/${grupo.id}`}>
            <div className="glass-card rounded-xl p-6 border border-white/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">
                            {grupo.nombre}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            <span className="font-medium">👤 Tutor:</span> {grupo.tutor}
                        </p>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                        {grupo._count?.estudiantes || 0} estudiantes
                    </div>
                </div>

                <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {grupo.aula}
                </div>
            </div>
        </Link>
    );
}
