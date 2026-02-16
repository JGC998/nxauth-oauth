export const authConfig = {
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/error',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirigir a login
            }

            if (isOnAdmin) {
                if (isLoggedIn && auth?.user?.role === 'ADMIN') return true;
                return false; // Redirigir a login o página de error/acceso denegado si es usuario normal
            }

            return true;
        },
    },
    providers: [], // Los proveedores se configuran en auth.js para evitar dependencias de Node en middleware
}
