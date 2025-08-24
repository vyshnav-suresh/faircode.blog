import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
// Helper to get access token from session cookie (SSR)
export async function getAccessTokenSSR() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value || cookieStore.get("__Secure-next-auth.session-token")?.value;
    if (!sessionToken) return null;

    // Decode the JWT to extract backend accessToken (if present)
    // This only works if NEXTAUTH_JWT_ENCRYPTION is false
    try {
      const decoded: any = jwt.decode(sessionToken);
      if (decoded?.accessToken) {
        return decoded.accessToken;
      }
      console.log("decoded", decoded);
      
    } catch {}
    // Fallback: return sessionToken itself
    return sessionToken;
  } catch {
    return null;
  }
}
