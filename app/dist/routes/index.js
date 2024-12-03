"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const protected_data_routes_1 = __importDefault(require("./protected-data.routes"));
const rootRouter = (0, express_1.Router)();
rootRouter.use("/auth", auth_routes_1.default);
rootRouter.use("/protected", protected_data_routes_1.default);
exports.default = rootRouter;
