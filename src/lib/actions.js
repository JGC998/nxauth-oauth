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
