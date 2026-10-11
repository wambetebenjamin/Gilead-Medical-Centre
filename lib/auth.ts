import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { verifyCaptcha, type CaptchaVersion } from "@/lib/captcha";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/portal/login", error: "/portal/login" },
  providers: [
    CredentialsProvider({
      name: "Patient portal",
      credentials: {
        patientId: { label: "Patient ID", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Verification", type: "text" },
        captchaVersion: { label: "Verification version", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.patientId || !credentials.password || !credentials.captchaToken) return null;
        const captcha = await verifyCaptcha(
          credentials.captchaToken,
          "staff_portal_login",
          (credentials.captchaVersion === "v2" ? "v2" : "v3") as CaptchaVersion,
        );
        if (!captcha.ok) return null;

        const authUrl = process.env.PATIENT_AUTH_URL;
        if (!authUrl) return null;
        try {
          const response = await fetch(authUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ patientId: credentials.patientId.trim(), password: credentials.password }),
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
          });
          if (!response.ok) return null;
          const user = (await response.json()) as { id?: string; name?: string; email?: string };
          if (!user.id) return null;
          return { id: user.id, name: user.name ?? "Gilead patient", email: user.email ?? null };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.patientId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = String(token.patientId ?? token.sub ?? "");
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-gilead.session-token" : "gilead.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
