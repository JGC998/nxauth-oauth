import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const asignatura = await prisma.asignatura.findUnique({
            where: { id: parseInt(id) },
            include: {
                estudiantes: {
                    include: {
                        grupo: true
                    },
                    orderBy: {
                        nombre: 'asc'
                    }
                }
            }
        });

        if (!asignatura) {
            return NextResponse.json(
                { error: 'Asignatura no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(asignatura);
    } catch (error) {
        console.error('Error fetching asignatura:', error);
        return NextResponse.json(
            { error: 'Error al obtener la asignatura' },
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

        const asignatura = await prisma.asignatura.update({
            where: { id: parseInt(id) },
            data: {
                nombre: data.nombre,
                profesor: data.profesor,
                horas_semana: parseInt(data.horas_semana)
            }
        });

        return NextResponse.json(asignatura);
    } catch (error) {
        console.error('Error updating asignatura:', error);
        return NextResponse.json(
            { error: 'Error al actualizar la asignatura' },
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

        await prisma.asignatura.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting asignatura:', error);
        return NextResponse.json(
            { error: 'Error al eliminar la asignatura' },
            { status: 500 }
        );
    }
}
