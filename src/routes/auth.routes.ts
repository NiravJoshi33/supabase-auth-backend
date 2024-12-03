import { Router, Request, Response } from "express";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseClient } from "../utils/supabase-utils";
import { FRONTEND_URL } from "../utils/env-vars";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.get("/confirm", async (req: Request, res: Response) => {
  const token_hash = req.query.token_hash as string;
  const type = req.query.type as EmailOtpType;
  const next = (req.query.next as string) || "/";

  if (!token_hash || !type) {
    return res.redirect(303, `${FRONTEND_URL}/auth/auth-code-error`);
  }

  const supabase = createSupabaseClient({ req, res });
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error) {
    console.error("Confirmation error:", error);
    return res.redirect(303, `${FRONTEND_URL}/auth/auth-code-error`);
  }

  return res.redirect(303, next);
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }

  const supabase = createSupabaseClient({ req, res });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${FRONTEND_URL}/dashboard` },
  });

  if (error) {
    console.error("Sign up error", error);
    res.status(400).json({ error: error.message });
    return;
  }

  res
    .status(200)
    .json({ message: "Successfully sent confirmation email", data: data });
  return;
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }

  const supabase = createSupabaseClient({ req, res });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in error", error);
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
  return;
});

authRouter.get("/google", async (req: Request, res: Response) => {
  console.log("google endpoint is hit");
  const supabase = createSupabaseClient({ req, res });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${FRONTEND_URL}/auth/callback` },
  });

  if (error) {
    console.error("Sign in error", error);
    res.status(400).json({ error: error.message });
    return;
  }

  if (data.url) {
    res.redirect(303, data.url);
  }
});

authRouter.get("/callback", async (req: Request, res: Response) => {
  console.log("callback endpoint is hit");
  const code = req.query.code as string;
  const next = (req.query.next as string) ?? `${FRONTEND_URL}/dashboard`;
  console.log(code, "code");

  if (!code) {
    console.log("No code provided");
    res.redirect(303, next);
    return;
  }

  const supabase = createSupabaseClient({ req, res });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code for session:", error);
    res.redirect(303, next);
    return;
  }

  res.redirect(303, next);
});

authRouter.post(
  "/logout",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("logout endpoint is hit");
    const user = req.user;

    if (!user) {
      console.log("User not found");
      res
        .status(401)
        .json({ error: "Unauthorized", message: "User not logged in" });
      return;
    }

    const supabase = createSupabaseClient({ req, res });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      res.status(400).json({ error: "Error signing out" });
      return;
    }
    res.status(200).json({ message: "Successfully signed out" });
  }
);

authRouter.get(
  "/current-user",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("current-user endpoint is hit");
    const { user } = req;
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.status(200).json({ user });
  }
);

export default authRouter;
