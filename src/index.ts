import express from "express";
import cors from "cors";
import { FRONTEND_URL } from "./utils/env-vars";
import rootRouter from "./routes";

const PORT = 5051;

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
