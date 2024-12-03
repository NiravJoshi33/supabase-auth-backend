import { User } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";
import { createSupabaseClient } from "../utils/supabase-utils";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("authMiddleware is hit");
  const supabase = createSupabaseClient({ req, res });

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log("Error retrieving user:", error);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  console.log("Authenticated user:", data.user);
  req.user = data.user;
  next();
};
