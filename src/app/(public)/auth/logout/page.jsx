import { signOut } from "@/auth";

export default function LogoutPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Cerrar Sesión</h1>
                <p className="text-gray-600 mb-6">¿Estás seguro de que quieres salir?</p>

                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/auth/login" });
                    }}
                    className="flex gap-4 justify-center"
                >
                    <button
                        type="submit"
                        className="bg-red-600 text-white px-6 py-2 rounded font-medium hover:bg-red-700 transition"
                    >
                        Sí, salir
                    </button>
                    <a href="/dashboard" className="bg-gray-200 text-gray-800 px-6 py-2 rounded font-medium hover:bg-gray-300 transition">
                        Cancelar
                    </a>
                </form>
            </div>
        </div>
    );
}
