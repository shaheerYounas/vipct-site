import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getEnv } from "@/lib/env";

export async function POST(request: NextRequest) {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anon) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const payload = await request.json().catch(() => null);
  const response = NextResponse.json({ ok: true });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  let error = null;
  if (payload?.code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(payload.code));
  } else if (payload?.access_token && payload?.refresh_token) {
    ({ error } = await supabase.auth.setSession({
      access_token: payload.access_token,
      refresh_token: payload.refresh_token
    }));
  } else {
    return NextResponse.json({ error: "Missing auth payload." }, { status: 400 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return response;
}
