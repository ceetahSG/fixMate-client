import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { message: "You must be signed in." },
      { status: 401 },
    );
  }

  const service = await request.json();
  const result = await db.collection("services").insertOne({
    ...service,
    technicianId: session.user.id,
    technician: {
      name: session.user.name,
      email: session.user.email,
    },
  });

  return NextResponse.json(
    {
      id: result.insertedId.toString(),
    },
    { status: 201 },
  );
}
