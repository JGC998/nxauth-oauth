const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    // Admin user for authentication
    const password = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            email: 'admin@admin.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
            image: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
        },
    })
    console.log({ admin })

    // Grupos (Class Groups)
    const grupos = await Promise.all([
        prisma.grupo.upsert({
            where: { nombre: '1º DAW' },
            update: {},
            create: { nombre: '1º DAW', tutor: 'María García', aula: 'Aula 101' }
        }),
        prisma.grupo.upsert({
            where: { nombre: '2º DAW' },
            update: {},
            create: { nombre: '2º DAW', tutor: 'José Martínez', aula: 'Aula 102' }
        }),
        prisma.grupo.upsert({
            where: { nombre: '1º ASIR' },
            update: {},
            create: { nombre: '1º ASIR', tutor: 'Ana López', aula: 'Aula 201' }
        }),
        prisma.grupo.upsert({
            where: { nombre: '2º ASIR' },
            update: {},
            create: { nombre: '2º ASIR', tutor: 'Carlos Ruiz', aula: 'Aula 202' }
        })
    ])
    console.log('Grupos creados:', grupos.length)

    // Asignaturas (Subjects)
    const asignaturas = await Promise.all([
        prisma.asignatura.create({
            data: { nombre: 'Programación', profesor: 'Juan Pérez', horas_semana: 8 }
        }),
        prisma.asignatura.create({
            data: { nombre: 'Bases de Datos', profesor: 'Laura Sánchez', horas_semana: 6 }
        }),
        prisma.asignatura.create({
            data: { nombre: 'Desarrollo Web', profesor: 'Miguel Torres', horas_semana: 8 }
        }),
        prisma.asignatura.create({
            data: { nombre: 'Sistemas Operativos', profesor: 'Elena Díaz', horas_semana: 6 }
        }),
        prisma.asignatura.create({
            data: { nombre: 'Redes', profesor: 'David Moreno', horas_semana: 5 }
        }),
        prisma.asignatura.create({
            data: { nombre: 'Seguridad Informática', profesor: 'Patricia Fernández', horas_semana: 4 }
        }),
        prisma.asignatura.create({
            data: { nombre: 'Inglés Técnico', profesor: 'Sarah Johnson', horas_semana: 3 }
        }),
        prisma.asignatura.create({
            data: { nombre: 'FOL', profesor: 'Roberto Jiménez', horas_semana: 3 }
        })
    ])
    console.log('Asignaturas creadas:', asignaturas.length)

    // Estudiantes (Students)
    const estudiantesData = [
        { nombre: 'Pablo González', fecha_nacimiento: new Date('2005-03-15'), tutor_legal: 'Carmen González', grupoId: grupos[0].id, asignaturas: [0, 1, 2, 6, 7] },
        { nombre: 'Lucía Fernández', fecha_nacimiento: new Date('2005-07-22'), tutor_legal: 'Antonio Fernández', grupoId: grupos[0].id, asignaturas: [0, 1, 2, 6, 7] },
        { nombre: 'Javier Rodríguez', fecha_nacimiento: new Date('2005-11-08'), tutor_legal: 'Isabel Rodríguez', grupoId: grupos[0].id, asignaturas: [0, 1, 2, 6, 7] },
        { nombre: 'Marina López', fecha_nacimiento: new Date('2006-01-30'), tutor_legal: 'Fernando López', grupoId: grupos[0].id, asignaturas: [0, 1, 2, 6, 7] },

        { nombre: 'Alejandro Martín', fecha_nacimiento: new Date('2004-05-12'), tutor_legal: 'Rosa Martín', grupoId: grupos[1].id, asignaturas: [0, 1, 2, 6, 7] },
        { nombre: 'Sara Jiménez', fecha_nacimiento: new Date('2004-09-18'), tutor_legal: 'Pedro Jiménez', grupoId: grupos[1].id, asignaturas: [0, 1, 2, 6, 7] },
        { nombre: 'Daniel Ruiz', fecha_nacimiento: new Date('2004-12-25'), tutor_legal: 'Marta Ruiz', grupoId: grupos[1].id, asignaturas: [0, 1, 2, 6, 7] },
        { nombre: 'Andrea Moreno', fecha_nacimiento: new Date('2005-02-14'), tutor_legal: 'Luis Moreno', grupoId: grupos[1].id, asignaturas: [0, 1, 2, 6, 7] },

        { nombre: 'Marcos Sánchez', fecha_nacimiento: new Date('2005-06-20'), tutor_legal: 'Julia Sánchez', grupoId: grupos[2].id, asignaturas: [3, 4, 5, 6, 7] },
        { nombre: 'Elena Torres', fecha_nacimiento: new Date('2005-10-03'), tutor_legal: 'Alberto Torres', grupoId: grupos[2].id, asignaturas: [3, 4, 5, 6, 7] },
        { nombre: 'Adrián Romero', fecha_nacimiento: new Date('2006-04-17'), tutor_legal: 'Cristina Romero', grupoId: grupos[2].id, asignaturas: [3, 4, 5, 6, 7] },

        { nombre: 'Paula Navarro', fecha_nacimiento: new Date('2004-08-09'), tutor_legal: 'Rafael Navarro', grupoId: grupos[3].id, asignaturas: [3, 4, 5, 6, 7] },
        { nombre: 'Diego Vargas', fecha_nacimiento: new Date('2004-11-27'), tutor_legal: 'Beatriz Vargas', grupoId: grupos[3].id, asignaturas: [3, 4, 5, 6, 7] },
        { nombre: 'Clara Castillo', fecha_nacimiento: new Date('2005-01-05'), tutor_legal: 'Sergio Castillo', grupoId: grupos[3].id, asignaturas: [3, 4, 5, 6, 7] },
        { nombre: 'Hugo Ortiz', fecha_nacimiento: new Date('2005-05-29'), tutor_legal: 'Mónica Ortiz', grupoId: grupos[3].id, asignaturas: [3, 4, 5, 6, 7] }
    ]

    for (const estudianteData of estudiantesData) {
        const { asignaturas: asigIds, ...data } = estudianteData
        await prisma.estudiante.create({
            data: {
                ...data,
                foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nombre)}&background=random`,
                asignaturas: {
                    connect: asigIds.map(id => ({ id: asignaturas[id].id }))
                }
            }
        })
    }
    console.log('Estudiantes creados:', estudiantesData.length)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
