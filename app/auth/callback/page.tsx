"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    let cancelled = false;

    async function finishSignIn() {
      const url = new URL(window.location.href);
      const next = url.searchParams.get("next") || "/admin";
      const code = url.searchParams.get("code");
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const authError = hash.get("error_description") || url.searchParams.get("error_description");

      if (authError) {
        router.replace(`/admin/login?error=${encodeURIComponent(authError)}`);
        return;
      }

      try {
        if (!code && (!accessToken || !refreshToken)) {
          throw new Error("Missing auth credentials in callback.");
        }

        const response = await fetch("/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            code
              ? { code }
              : {
                  access_token: accessToken,
                  refresh_token: refreshToken
                }
          )
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Unable to persist session.");
        }

        if (!cancelled) {
          window.history.replaceState({}, document.title, "/auth/callback");
          window.location.replace(next);
        }
      } catch (error) {
        const detail = error instanceof Error ? error.message : "callback";
        if (!cancelled) {
          setMessage("Login failed. Redirecting back to admin login...");
          router.replace(`/admin/login?error=${encodeURIComponent(detail)}`);
        }
      }
    }

    finishSignIn();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="admin-shell">
      <div className="admin-main">
        <article className="admin-card wide">
          <h1>Admin callback</h1>
          <p className="admin-muted">{message}</p>
        </article>
      </div>
    </main>
  );
}
