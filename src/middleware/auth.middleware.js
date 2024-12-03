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
exports.authMiddleware = void 0;
const supabase_utils_1 = require("../utils/supabase-utils");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("authMiddleware is hit");
    const supabase = (0, supabase_utils_1.createSupabaseClient)({ req, res });
    const { data, error } = yield supabase.auth.getUser();
    if (error || !data.user) {
        console.log("Error retrieving user:", error);
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    console.log("Authenticated user:", data.user);
    req.user = data.user;
    next();
});
exports.authMiddleware = authMiddleware;
