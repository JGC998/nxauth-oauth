import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";

export default async function ProtectedLayout({ children }) {
    const session = await auth();

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar user={session.user} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header (Optional, for now handled by responsive sidebar logic if expanded later, 
            but for MVP responsive we'd need a hamburger menu. Keeping it simple as "Sidebar Layout" for desktop first) */}

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
