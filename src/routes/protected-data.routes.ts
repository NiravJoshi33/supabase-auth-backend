import { Router, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const protectedRouter = Router();

protectedRouter.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const backendData = {
      port: 5050,
      message: "Hello from backend",
    };

    res.status(200).json(backendData);
  }
);

export default protectedRouter;
