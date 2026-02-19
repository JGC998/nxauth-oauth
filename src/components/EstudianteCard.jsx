import Link from "next/link";

export default function EstudianteCard({ estudiante }) {
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

    return (
        <Link href={`/estudiantes/${estudiante.id}`}>
            <div className="glass-card rounded-xl p-6 border border-white/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start gap-4">
                    {estudiante.foto ? (
                        <img
                            src={estudiante.foto}
                            alt={estudiante.nombre}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white border-2 border-primary/20">
                            {estudiante.nombre?.charAt(0)}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                            {estudiante.nombre}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {calcularEdad(estudiante.fecha_nacimiento)} años
                        </p>
                        {estudiante.grupo && (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                                    {estudiante.grupo.nombre}
                                </span>
                                {estudiante._count?.asignaturas && (
                                    <span className="text-xs text-slate-500">
                                        {estudiante._count.asignaturas} asignaturas
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
