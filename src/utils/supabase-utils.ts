import { Request, Response } from "express";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env-vars";

export const createSupabaseClient = (context: {
  req: Request;
  res: Response;
}) => {
  const client = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.req.headers.cookie ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          context.res.appendHeader(
            "Set-Cookie",
            serializeCookieHeader(name, value, options)
          )
        );
      },
    },
  });

  return client;
};
