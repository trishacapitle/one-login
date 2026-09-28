import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password } = body;

    if (action === "demo") {
      return NextResponse.json({
        user: {
          id: "demo-sole-trader-001",
          email: "demo@onelogin.app",
          isDemo: true,
        },
      });
    }

    if (action === "login" || action === "signup") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const userId = `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "-")}`;

      return NextResponse.json({
        user: {
          id: userId,
          email: cleanEmail,
          isDemo: cleanEmail === "demo@onelogin.app",
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
