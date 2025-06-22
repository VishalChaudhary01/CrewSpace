import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";

import { config } from "./config/env.config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import v1Routes from "./routes/v1";
import { baseLimiter } from "./utils/limiter";

export const createServer = () => {
  const app = express();
  app
    .use(cors({ origin: config.FRONTEND_URL, credentials: true }))
    .use(helmet())
    .use(baseLimiter)
    .use(express.json({ limit: "50kb" }))
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser());

  app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  app.use(`${config.BASE_PATH}/v1`, v1Routes);

  app.use(errorHandler);

  return app;
};
