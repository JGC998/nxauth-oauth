import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const estudiante = await prisma.estudiante.findUnique({
            where: { id: parseInt(id) },
            include: {
                grupo: true,
                asignaturas: {
                    orderBy: {
                        nombre: 'asc'
                    }
                }
            }
        });

        if (!estudiante) {
            return NextResponse.json(
                { error: 'Estudiante no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(estudiante);
    } catch (error) {
        console.error('Error fetching estudiante:', error);
        return NextResponse.json(
            { error: 'Error al obtener el estudiante' },
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

        const estudiante = await prisma.estudiante.update({
            where: { id: parseInt(id) },
            data: {
                nombre: data.nombre,
                fecha_nacimiento: new Date(data.fecha_nacimiento),
                foto: data.foto,
                tutor_legal: data.tutor_legal,
                grupoId: data.grupoId ? parseInt(data.grupoId) : null,
                asignaturas: data.asignaturas ? {
                    set: data.asignaturas.map(id => ({ id: parseInt(id) }))
                } : undefined
            }
        });

        return NextResponse.json(estudiante);
    } catch (error) {
        console.error('Error updating estudiante:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el estudiante' },
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

        await prisma.estudiante.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting estudiante:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el estudiante' },
            { status: 500 }
        );
    }
}
