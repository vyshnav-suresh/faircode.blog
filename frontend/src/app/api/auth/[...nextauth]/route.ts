import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

interface AuthorizeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  token: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post<AuthorizeResponse>(`${apiBaseUrl}/auth/login`, credentials);
          const user = res.data.user;
          if (user && res.data.token) {
            return { ...user, token: res.data.token };
          }
          // If backend did not return user/token, throw error with backend message
          throw new Error((res.data && (res.data as any).message) || "Invalid credentials");
        } catch (e: any) {
          // Surface backend error message if available
          const message = e?.response?.data?.message || "Login failed";
          throw new Error(message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user?.token) {
        token.accessToken = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
