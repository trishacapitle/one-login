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
      if (!cleanEmail.includes("@")) {
        return NextResponse.json(
          { error: "Please enter a valid email address" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

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
