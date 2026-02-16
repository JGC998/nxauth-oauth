'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({ role }) {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    const linkClasses = (path) =>
        `text-sm font-medium transition px-4 py-2 rounded-lg ${isActive(path)
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-slate-500 hover:text-primary hover:bg-slate-50'
        }`;

    const adminLinkClasses =
        `text-sm font-medium transition px-4 py-2 rounded-lg ${isActive('/admin')
            ? 'bg-secondary/10 text-secondary font-semibold'
            : 'text-slate-500 hover:text-secondary hover:bg-secondary/5'
        }`;


    return (
        <nav className="hidden md:flex gap-2">
            <Link href="/" className={linkClasses('/')}>
                Inicio
            </Link>
            <Link href="/dashboard" className={linkClasses('/dashboard')}>
                Dashboard
            </Link>
            {role === 'ADMIN' && (
                <Link href="/admin" className={adminLinkClasses}>
                    Admin Panel
                </Link>
            )}
        </nav>
    );
}
