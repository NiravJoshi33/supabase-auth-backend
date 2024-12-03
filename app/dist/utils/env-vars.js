"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPABASE_ANON_KEY = exports.SUPABASE_URL = exports.FRONTEND_URL = void 0;
require("dotenv/config");
exports.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
exports.SUPABASE_URL = process.env.SUPABASE_URL;
exports.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!exports.SUPABASE_URL || !exports.SUPABASE_ANON_KEY) {
    console.log("Missing environment variables");
    process.exit(1);
}
