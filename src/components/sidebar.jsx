'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Home, GraduationCap, UserSquare, BookOpen } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar({ user }) {
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            role: 'USER', // Visible for everyone (User & Admin)
        },
    ];

    const schoolItems = [
        {
            name: 'Grupos',
            href: '/grupos',
            icon: Users,
            role: 'USER', // Visible for everyone
        },
        {
            name: 'Estudiantes',
            href: '/estudiantes',
            icon: UserSquare,
            role: 'USER',
        },
        {
            name: 'Asignaturas',
            href: '/asignaturas',
            icon: BookOpen,
            role: 'USER',
        },
    ];

    const adminItems = [
        {
            name: 'Admin Usuarios',
            href: '/admin',
            icon: GraduationCap,
            role: 'ADMIN', // Only for Admin
        },
        {
            name: 'Gestionar Grupos',
            href: '/admin/grupos',
            icon: Users,
            role: 'ADMIN',
        },
        {
            name: 'Gestionar Estudiantes',
            href: '/admin/estudiantes',
            icon: UserSquare,
            role: 'ADMIN',
        },
        {
            name: 'Gestionar Asignaturas',
            href: '/admin/asignaturas',
            icon: BookOpen,
            role: 'ADMIN',
        },
    ];


    const isActive = (path) => pathname === path;

    return (
        <aside className="w-64 glass border-r border-white/20 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                    N
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">NextAuth</span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <nav className="space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Inicio
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Aplicación
                        </p>
                    </div>

                    {menuItems.map((item) => {
                        const isActiveItem = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActiveItem
                                    ? 'bg-primary/10 text-primary shadow-sm font-semibold'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActiveItem ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Datos Escolares
                        </p>
                    </div>

                    {schoolItems.map((item) => {
                        const isActiveItem = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActiveItem
                                    ? 'bg-primary/10 text-primary shadow-sm font-semibold'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActiveItem ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {user.role === 'ADMIN' && (
                        <>
                            <div className="pt-4 pb-2">
                                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Administración
                                </p>
                            </div>

                            {adminItems.map((item) => {
                                const isActiveItem = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActiveItem
                                            ? 'bg-primary/10 text-primary shadow-sm font-semibold'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActiveItem ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </>
                    )}

                </nav>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 border border-white/20 shadow-sm">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {user.name?.charAt(0)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate capitalize">
                            {user.role}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
