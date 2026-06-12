import assert from "node:assert/strict";
import { test } from "node:test";

import bcrypt from "bcryptjs";

import {
  authenticateCredentials,
  type AuthenticatedUser,
} from "@/lib/auth/credentials";
import { registerUser } from "@/lib/auth/register";

test("registerUser rejects invalid payloads", async () => {
  const prisma = {
    user: {
      findUnique: async () => null,
      create: async () => {
        throw new Error("should not create");
      },
    },
  };

  const result = await registerUser(prisma as never, {
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.equal(result.error, "Invalid registration data.");
});

test("registerUser normalizes and stores a new user", async () => {
  type CreateArgs = {
    name: string;
    email: string;
    passwordHash: string;
  };

  let createArgs: CreateArgs | null = null;
  let createdPasswordHash = "";

  const prisma = {
    user: {
      findUnique: async () => null,
      create: async (args: {
        data: CreateArgs;
        select: Record<string, boolean>;
      }) => {
        createArgs = args.data;
        createdPasswordHash = args.data.passwordHash;

        return {
          id: "user_1",
          name: "Test User",
          email: "test@example.com",
          image: null,
          createdAt: new Date("2026-06-12T00:00:00.000Z"),
        };
      },
    },
  };

  const result = await registerUser(prisma as never, {
    name: "  Test User  ",
    email: "TEST@Example.com",
    password: "password123",
    confirmPassword: "password123",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.user, {
    id: "user_1",
    name: "Test User",
    email: "test@example.com",
    image: null,
    createdAt: new Date("2026-06-12T00:00:00.000Z"),
  });
  const storedCreateArgs = createArgs;

  if (!storedCreateArgs) {
    throw new Error("Expected createArgs to be set");
  }
  assert.deepEqual(storedCreateArgs, {
    name: "Test User",
    email: "test@example.com",
    passwordHash: createdPasswordHash,
  });
  assert.equal(typeof createdPasswordHash, "string");
  assert.notEqual(createdPasswordHash, "password123");
});

test("authenticateCredentials accepts a valid email/password pair", async () => {
  const passwordHash = await bcrypt.hash("password123", 10);
  const prisma = {
    user: {
      findUnique: async () => ({
        id: "user_1",
        name: "Test User",
        email: "test@example.com",
        image: null,
        passwordHash,
      }),
    },
  };

  const result = (await authenticateCredentials(prisma as never, {
    email: "TEST@example.com",
    password: "password123",
  })) as AuthenticatedUser | null;

  assert.deepEqual(result, {
    id: "user_1",
    name: "Test User",
    email: "test@example.com",
    image: null,
  });
});

test("authenticateCredentials rejects a bad password", async () => {
  const passwordHash = await bcrypt.hash("password123", 10);
  const prisma = {
    user: {
      findUnique: async () => ({
        id: "user_1",
        name: "Test User",
        email: "test@example.com",
        image: null,
        passwordHash,
      }),
    },
  };

  const result = await authenticateCredentials(prisma as never, {
    email: "test@example.com",
    password: "wrong-password",
  });

  assert.equal(result, null);
});
