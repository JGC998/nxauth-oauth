import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const grupo = await prisma.grupo.findUnique({
            where: { id: parseInt(id) },
            include: {
                estudiantes: {
                    orderBy: {
                        nombre: 'asc'
                    }
                }
            }
        });

        if (!grupo) {
            return NextResponse.json(
                { error: 'Grupo no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(grupo);
    } catch (error) {
        console.error('Error fetching grupo:', error);
        return NextResponse.json(
            { error: 'Error al obtener el grupo' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await auth();

        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const data = await request.json();

        const grupo = await prisma.grupo.update({
            where: { id: parseInt(id) },
            data: {
                nombre: data.nombre,
                tutor: data.tutor,
                aula: data.aula
            }
        });

        return NextResponse.json(grupo);
    } catch (error) {
        console.error('Error updating grupo:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el grupo' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await auth();

        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        const { id } = await params;

        await prisma.grupo.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting grupo:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el grupo' },
            { status: 500 }
        );
    }
}
