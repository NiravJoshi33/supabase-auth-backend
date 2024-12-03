"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_utils_1 = require("../utils/supabase-utils");
const env_vars_1 = require("../utils/env-vars");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authRouter = (0, express_1.Router)();
authRouter.get("/confirm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token_hash = req.query.token_hash;
    const type = req.query.type;
    const next = req.query.next || "/";
    if (!token_hash || !type) {
        return res.redirect(303, `${env_vars_1.FRONTEND_URL}/auth/auth-code-error`);
    }
    const supabase = (0, supabase_utils_1.createSupabaseClient)({ req, res });
    const { error } = yield supabase.auth.verifyOtp({
        token_hash,
        type,
    });
    if (error) {
        console.error("Confirmation error:", error);
        return res.redirect(303, `${env_vars_1.FRONTEND_URL}/auth/auth-code-error`);
    }
    return res.redirect(303, next);
}));
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Missing email or password" });
        return;
    }
    const supabase = (0, supabase_utils_1.createSupabaseClient)({ req, res });
    const { data, error } = yield supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${env_vars_1.FRONTEND_URL}/dashboard` },
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
}));
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Missing email or password" });
        return;
    }
    const supabase = (0, supabase_utils_1.createSupabaseClient)({ req, res });
    const { data, error } = yield supabase.auth.signInWithPassword({
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
}));
authRouter.get("/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("google endpoint is hit");
    const supabase = (0, supabase_utils_1.createSupabaseClient)({ req, res });
    const { data, error } = yield supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${env_vars_1.FRONTEND_URL}/auth/callback` },
    });
    if (error) {
        console.error("Sign in error", error);
        res.status(400).json({ error: error.message });
        return;
    }
    if (data.url) {
        res.redirect(303, data.url);
    }
}));
authRouter.get("/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("callback endpoint is hit");
    const code = req.query.code;
    const next = (_a = req.query.next) !== null && _a !== void 0 ? _a : `${env_vars_1.FRONTEND_URL}/dashboard`;
    console.log(code, "code");
    if (!code) {
        console.log("No code provided");
        res.redirect(303, next);
        return;
    }
    const supabase = (0, supabase_utils_1.createSupabaseClient)({ req, res });
    const { data, error } = yield supabase.auth.exchangeCodeForSession(code);
    if (error) {
        console.error("Error exchanging code for session:", error);
        res.redirect(303, next);
        return;
    }
    res.redirect(303, next);
}));
authRouter.post("/logout", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logout endpoint is hit");
    const user = req.user;
    if (!user) {
        console.log("User not found");
        res
            .status(401)
            .json({ error: "Unauthorized", message: "User not logged in" });
        return;
    }
    const supabase = (0, supabase_utils_1.createSupabaseClient)({ req, res });
    const { error } = yield supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
        res.status(400).json({ error: "Error signing out" });
        return;
    }
    res.status(200).json({ message: "Successfully signed out" });
}));
authRouter.get("/current-user", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("current-user endpoint is hit");
    const { user } = req;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    res.status(200).json({ user });
}));
exports.default = authRouter;
