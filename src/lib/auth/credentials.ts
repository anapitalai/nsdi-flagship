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

function logCredentialFailure(
  reason: string,
  details?: Record<string, string | boolean | number | null>,
) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.warn("[auth][credentials]", reason, details ?? {});
}

function logCredentialEvent(
  reason: string,
  details?: Record<string, string | boolean | number | null>,
) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.info("[auth][credentials]", reason, details ?? {});
}

export async function authenticateCredentials(
  prisma: Pick<PrismaClient, "user">,
  payload: unknown,
): Promise<AuthenticatedUser | null> {
  if (typeof payload === "object" && payload !== null) {
    const record = payload as Record<string, unknown>;
    logCredentialEvent("received-payload", {
      hasEmail: typeof record.email === "string",
      email:
        typeof record.email === "string" ? record.email.toLowerCase().trim() : null,
      passwordLength:
        typeof record.password === "string" ? record.password.length : null,
    });
  } else {
    logCredentialEvent("received-payload", {
      hasEmail: false,
      email: null,
      passwordLength: null,
    });
  }

  const parsedCredentials = credentialsSchema.safeParse(payload);

  if (!parsedCredentials.success) {
    logCredentialFailure("invalid-payload");
    return null;
  }

  const { email, password } = parsedCredentials.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user?.passwordHash) {
    logCredentialFailure("user-not-found-or-missing-password", {
      email,
      hasUser: Boolean(user),
      hasPasswordHash: Boolean(user?.passwordHash),
    });
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    logCredentialFailure("password-mismatch", { email });
    return null;
  }

  logCredentialEvent("sign-in-success", { email });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
