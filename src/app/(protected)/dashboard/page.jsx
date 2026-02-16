import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import EditProfileForm from "./edit-form";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-primary/10">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Bienvenido, {session.user.name}</p>
                </div>
                <div className="text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/20 shadow-sm backdrop-blur-sm">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/40">
                    <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-90"></div>
                    <div className="px-8 pb-8 relative">
                        <div className="flex justify-between items-end -mt-12 mb-8">
                            {session.user.image ? (
                                <img src={session.user.image} alt="Avatar" className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-white object-cover" />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white">
                                    {session.user.name?.charAt(0)}
                                </div>
                            )}
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${session.user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                {session.user.role}
                            </span>
                        </div>

                        <div className="grid gap-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Nombre</p>
                                    <p className="font-semibold text-slate-900 text-lg">{session.user.name}</p>
                                </div>
                                <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Email</p>
                                    <p className="font-semibold text-slate-900 text-lg">{session.user.email}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-secondary rounded-full"></span>
                                    Editar Perfil
                                </h3>
                                <EditProfileForm user={session.user} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats / Info Column */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl shadow-indigo-900/20 p-6 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                        </div>
                        <h3 className="font-bold text-xl mb-2 relative z-10">Estado del Sistema</h3>
                        <p className="text-indigo-100 text-sm mb-6 relative z-10">Todo funciona correctamente. El sistema está operando a máxima capacidad.</p>
                        <div className="flex items-center gap-3 text-xs font-mono bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10 relative z-10">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse-slow shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                            <span className="font-semibold text-green-200">ONLINE</span>
                            <span className="text-white/40">|</span>
                            <span>v1.0.0</span>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-white/40">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Acciones Rápidas</h3>
                        <form action={async () => {
                            'use server';
                            await signOut();
                        }}>
                            <button type="submit" className="w-full group relative overflow-hidden rounded-xl bg-red-500 px-4 py-3 text-white shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5 hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                <span className="relative z-10 font-bold flex items-center justify-center gap-2">
                                    Cerrar Sesión
                                </span>
                                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-600 to-red-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
