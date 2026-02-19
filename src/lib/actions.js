'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Esquemas de validación
const registerSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.string().default('USER'), // Por defecto USER
});

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export async function authenticate(prevState, formData) {
    const data = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: 'Campos inválidos' };
    }

    try {
        await signIn('credentials', {
            ...parsed.data,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Credenciales inválidas.' };
                default:
                    return { error: 'Algo salió mal.' };
            }
        }
        throw error;
    }
}

export async function register(prevState, formData) {
    const data = Object.fromEntries(formData);
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    const { name, email, password } = parsed.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'El usuario ya existe con ese email.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Aseguramos que el registro público sea siempre USER
                image: `https://ui-avatars.com/api/?name=${name}&background=random`
            },
        });

        // Opcional: Auto-login tras registro
        // await signIn('credentials', { email, password, redirect: false });

        return { success: true };
    } catch (error) {
        console.error('Error en registro:', error);
        return { error: 'Error al registrar usuario.' };
    }
}

export async function loginGitHub() {
    await signIn("github");
}

// Acción para login social
export async function socialLogin(provider) {
    await signIn(provider);
}

export async function updateProfile(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (!session?.user) return { error: "No autorizado" };

    const name = formData.get("name");
    const email = formData.get("email"); // Opcional: permitir cambiar email requiere re-verificación a menudo
    // Por simplicidad, permitamos cambiar nombre e imagen (si hubiera campo de imagen en form)

    if (!name) return { error: "El nombre es obligatorio" };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name },
        });
        return { success: true, message: "Perfil actualizado correctamente" };
    } catch (error) {
        console.error(error);
        return { error: "Error al actualizar perfil" };
    }
}

// --- ADMIN ACTIONS ---

export async function adminCreateUser(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role") || "USER";

    if (!email || !password || !name) return { error: "Faltan campos" };

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { error: "Usuario ya existe" };

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { name, email, password: hashedPassword, role }
        });
        return { success: true, message: "Usuario creado" };
    } catch (err) {
        return { error: "Error al crear usuario" };
    }
}

export async function adminDeleteUser(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const userId = formData.get("userId");
    if (!userId) return { error: "ID de usuario es obligatorio" };

    try {
        await prisma.user.delete({ where: { id: userId } });
        return { success: true, message: "Usuario eliminado" };
    } catch (err) {
        console.error(err);
        return { error: "Error al eliminar usuario" };
    }
}

export async function adminUpdateUser(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const userId = formData.get("userId");
    const name = formData.get("name");
    const email = formData.get("email");
    const role = formData.get("role");

    if (!userId) return { error: "ID de usuario es obligatorio" };

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
        return { success: true, message: "No hay datos para actualizar" };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        return { success: true, message: "Usuario actualizado" };
    } catch (err) {
        console.error(err);
        return { error: "Error al actualizar usuario" };
    }
}

// --- GRUPOS ADMIN ACTIONS ---

export async function adminCreateGrupo(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const nombre = formData.get("nombre");
    const tutor = formData.get("tutor");
    const aula = formData.get("aula");

    if (!nombre || !tutor || !aula) return { error: "Todos los campos son obligatorios" };

    try {
        await prisma.grupo.create({
            data: { nombre, tutor, aula }
        });
        return { success: true, message: "Grupo creado correctamente" };
    } catch (err) {
        console.error(err);
        if (err.code === 'P2002') {
            return { error: "Ya existe un grupo con ese nombre" };
        }
        return { error: "Error al crear grupo" };
    }
}

export async function adminDeleteGrupo(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const grupoId = formData.get("grupoId");
    if (!grupoId) return { error: "ID de grupo es obligatorio" };

    try {
        await prisma.grupo.delete({
            where: { id: parseInt(grupoId) }
        });
        return { success: true, message: "Grupo eliminado" };
    } catch (err) {
        console.error(err);
        return { error: "Error al eliminar grupo" };
    }
}

// --- ESTUDIANTES ADMIN ACTIONS ---

export async function adminCreateEstudiante(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const nombre = formData.get("nombre");
    const fecha_nacimiento = formData.get("fecha_nacimiento");
    const tutor_legal = formData.get("tutor_legal");
    const grupoId = formData.get("grupoId");

    if (!nombre || !fecha_nacimiento || !tutor_legal) {
        return { error: "Nombre, fecha de nacimiento y tutor legal son obligatorios" };
    }

    try {
        const data = {
            nombre,
            fecha_nacimiento: new Date(fecha_nacimiento),
            tutor_legal
        };

        if (grupoId && grupoId !== "") {
            data.grupoId = parseInt(grupoId);
        }

        await prisma.estudiante.create({ data });
        return { success: true, message: "Estudiante creado correctamente" };
    } catch (err) {
        console.error(err);
        return { error: "Error al crear estudiante" };
    }
}

export async function adminDeleteEstudiante(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const estudianteId = formData.get("estudianteId");
    if (!estudianteId) return { error: "ID de estudiante es obligatorio" };

    try {
        await prisma.estudiante.delete({
            where: { id: parseInt(estudianteId) }
        });
        return { success: true, message: "Estudiante eliminado" };
    } catch (err) {
        console.error(err);
        return { error: "Error al eliminar estudiante" };
    }
}

// --- ASIGNATURAS ADMIN ACTIONS ---

export async function adminCreateAsignatura(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const nombre = formData.get("nombre");
    const profesor = formData.get("profesor");
    const horas_semana = formData.get("horas_semana");

    if (!nombre || !horas_semana) {
        return { error: "Nombre y horas por semana son obligatorios" };
    }

    try {
        const data = {
            nombre,
            horas_semana: parseInt(horas_semana)
        };

        if (profesor && profesor !== "") {
            data.profesor = profesor;
        }

        await prisma.asignatura.create({ data });
        return { success: true, message: "Asignatura creada correctamente" };
    } catch (err) {
        console.error(err);
        return { error: "Error al crear asignatura" };
    }
}

export async function adminDeleteAsignatura(prevState, formData) {
    const session = await import("@/auth").then(m => m.auth());
    if (session?.user?.role !== 'ADMIN') return { error: "No autorizado" };

    const asignaturaId = formData.get("asignaturaId");
    if (!asignaturaId) return { error: "ID de asignatura es obligatorio" };

    try {
        await prisma.asignatura.delete({
            where: { id: parseInt(asignaturaId) }
        });
        return { success: true, message: "Asignatura eliminada" };
    } catch (err) {
        console.error(err);
        return { error: "Error al eliminar asignatura" };
    }
}
