import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminUserForm from "./admin-user-form";
import AdminUserList from "./admin-user-list";

export default async function AdminPage() {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/");
    }

    const users = await prisma.user.findMany({
        orderBy: { email: 'asc' }
    });

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Administración</h1>
                    <p className="text-gray-500 mt-1">Gestión de usuarios y permisos</p>
                </div>
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    Admin Mode
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Lista de Usuarios (Ocupa 2 columnas) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Usuarios</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Total: {users.length}</span>
                        </div>
                        <AdminUserList users={users} />
                    </div>
                </div>

                {/* Columna Derecha: Crear Usuario (Ocupa 1 columna) */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Nuevo Usuario</h2>
                            <p className="text-sm text-gray-500 mt-1">Registrar manualmente un usuario.</p>
                        </div>
                        <AdminUserForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
