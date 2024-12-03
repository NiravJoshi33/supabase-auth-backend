"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = void 0;
const ssr_1 = require("@supabase/ssr");
const env_vars_1 = require("./env-vars");
const createSupabaseClient = (context) => {
    const client = (0, ssr_1.createServerClient)(env_vars_1.SUPABASE_URL, env_vars_1.SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                var _a;
                return (0, ssr_1.parseCookieHeader)((_a = context.req.headers.cookie) !== null && _a !== void 0 ? _a : "");
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => context.res.appendHeader("Set-Cookie", (0, ssr_1.serializeCookieHeader)(name, value, options)));
            },
        },
    });
    return client;
};
exports.createSupabaseClient = createSupabaseClient;
