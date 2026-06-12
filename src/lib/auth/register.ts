import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

import type { PrismaClient } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type RegisterSuccess = {
  ok: true;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: Date;
  };
};

export type RegisterFailure = {
  ok: false;
  status: number;
  error: string;
};

export type RegisterResult = RegisterSuccess | RegisterFailure;

export async function registerUser(
  prisma: Pick<PrismaClient, "user">,
  payload: unknown,
): Promise<RegisterResult> {
  const parsedBody = registerSchema.safeParse(payload);

  if (!parsedBody.success) {
    return {
      ok: false,
      status: 400,
      error: "Invalid registration data.",
    };
  }

  const { name, email, password, confirmPassword } = parsedBody.data;

  if (password !== confirmPassword) {
    return {
      ok: false,
      status: 400,
      error: "Passwords do not match.",
    };
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return {
      ok: false,
      status: 409,
      error: "A user with that email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      user,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        status: 409,
        error: "A user with that email already exists.",
      };
    }

    throw error;
  }
}
