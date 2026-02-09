import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface ICookieStore extends ReturnType<typeof cookies> {
  getAll: () => Promise<{ name: string; value: string }[]>;
  set: (name: string, value: string, options: CookieOptions) => void;
  setAll: (
    cookiesToSet: { name: string; value: string; options: CookieOptions }[]
  ) => void;
}

export const createClient = (cookieStore: ICookieStore) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options ?? {})
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
