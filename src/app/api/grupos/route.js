import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        const grupos = await prisma.grupo.findMany({
            include: {
                _count: {
                    select: { estudiantes: true }
                }
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        return NextResponse.json(grupos);
    } catch (error) {
        console.error('Error fetching grupos:', error);
        return NextResponse.json(
            { error: 'Error al obtener los grupos' },
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

        const grupo = await prisma.grupo.create({
            data: {
                nombre: data.nombre,
                tutor: data.tutor,
                aula: data.aula
            }
        });

        return NextResponse.json(grupo, { status: 201 });
    } catch (error) {
        console.error('Error creating grupo:', error);
        return NextResponse.json(
            { error: 'Error al crear el grupo' },
            { status: 500 }
        );
    }
}

