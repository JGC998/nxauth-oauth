import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        const estudiantes = await prisma.estudiante.findMany({
            include: {
                grupo: true,
                _count: {
                    select: { asignaturas: true }
                }
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        return NextResponse.json(estudiantes);
    } catch (error) {
        console.error('Error fetching estudiantes:', error);
        return NextResponse.json(
            { error: 'Error al obtener los estudiantes' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await auth();

        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const estudiante = await prisma.estudiante.create({
            data: {
                nombre: data.nombre,
                fecha_nacimiento: new Date(data.fecha_nacimiento),
                foto: data.foto,
                tutor_legal: data.tutor_legal,
                grupoId: data.grupoId ? parseInt(data.grupoId) : null,
                asignaturas: data.asignaturas ? {
                    connect: data.asignaturas.map(id => ({ id: parseInt(id) }))
                } : undefined
            }
        });

        return NextResponse.json(estudiante, { status: 201 });
    } catch (error) {
        console.error('Error creating estudiante:', error);
        return NextResponse.json(
            { error: 'Error al crear el estudiante' },
            { status: 500 }
        );
    }
}
