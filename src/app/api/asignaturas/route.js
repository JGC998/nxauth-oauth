import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        const asignaturas = await prisma.asignatura.findMany({
            include: {
                _count: {
                    select: { estudiantes: true }
                }
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        return NextResponse.json(asignaturas);
    } catch (error) {
        console.error('Error fetching asignaturas:', error);
        return NextResponse.json(
            { error: 'Error al obtener las asignaturas' },
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

        const asignatura = await prisma.asignatura.create({
            data: {
                nombre: data.nombre,
                profesor: data.profesor,
                horas_semana: parseInt(data.horas_semana)
            }
        });

        return NextResponse.json(asignatura, { status: 201 });
    } catch (error) {
        console.error('Error creating asignatura:', error);
        return NextResponse.json(
            { error: 'Error al crear la asignatura' },
            { status: 500 }
        );
    }
}
