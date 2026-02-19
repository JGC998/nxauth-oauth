import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AsignaturaForm from "./AsignaturaForm";
import AsignaturaList from "./AsignaturaList";

export default async function AdminAsignaturasPage() {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/");
    }

    const asignaturas = await prisma.asignatura.findMany({
        orderBy: { nombre: 'asc' }
    });

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Gestión de Asignaturas</h1>
                    <p className="text-gray-500 mt-1">Administrar asignaturas</p>
                </div>
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    Admin Mode
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Lista de Asignaturas (Ocupa 2 columnas) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Asignaturas</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Total: {asignaturas.length}</span>
                        </div>
                        <AsignaturaList asignaturas={asignaturas} />
                    </div>
                </div>

                {/* Columna Derecha: Crear Asignatura (Ocupa 1 columna) */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Nueva Asignatura</h2>
                            <p className="text-sm text-gray-500 mt-1">Registrar una nueva asignatura.</p>
                        </div>
                        <AsignaturaForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
