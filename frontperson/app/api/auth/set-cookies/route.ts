import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, role } = await req.json();

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: "token",
    value: token,
    path: "/",
  });

  response.cookies.set({
    name: "role",
    value: role,
    path: "/",
  });

  return response;
}
