import "dotenv/config";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
export const SUPABASE_URL = process.env.SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log("Missing environment variables");
  process.exit(1);
}
