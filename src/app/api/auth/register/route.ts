import { NextResponse } from "next/server";

import prisma from "@/lib/db/prisma";
import { registerUser } from "@/lib/auth/register";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await registerUser(prisma, body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(
    {
      user: result.user,
      message: "Registration successful.",
    },
    { status: 201 },
  );
}
