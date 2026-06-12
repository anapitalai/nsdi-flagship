import bcrypt from "bcryptjs";
import { z } from "zod";

import type { PrismaClient } from "@prisma/client";

const credentialsSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;

export type AuthenticatedUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export async function authenticateCredentials(
  prisma: Pick<PrismaClient, "user">,
  payload: unknown,
): Promise<AuthenticatedUser | null> {
  const parsedCredentials = credentialsSchema.safeParse(payload);

  if (!parsedCredentials.success) {
    return null;
  }

  const { email, password } = parsedCredentials.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user?.passwordHash) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
