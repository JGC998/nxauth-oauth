import EstudianteCard from "@/components/EstudianteCard";

async function getEstudiantes() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/estudiantes`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Error al cargar los estudiantes');
    }

    return res.json();
}

export default async function EstudiantesPage() {
    const estudiantes = await getEstudiantes();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-primary/10">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Estudiantes
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Listado de todos los estudiantes del centro
                    </p>
                </div>
                <div className="text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                    {estudiantes.length} estudiantes
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {estudiantes.map((estudiante) => (
                    <EstudianteCard key={estudiante.id} estudiante={estudiante} />
                ))}
            </div>

            {estudiantes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">No hay estudiantes registrados</p>
                </div>
            )}
        </div>
    );
}
