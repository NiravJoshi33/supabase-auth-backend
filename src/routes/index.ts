import { Router } from "express";
import authRouter from "./auth.routes";
import protectedRouter from "./protected-data.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/protected", protectedRouter);

export default rootRouter;
