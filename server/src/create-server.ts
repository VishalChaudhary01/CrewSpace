import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { config } from "./config/env.config";
import v1Routes from "./routes/v1";
import { baseLimiter } from "./utils/limiter";

export const createServer = () => {
  const app = express();
  app
    .use(ExpressMongoSanitize())
    .use(helmet())
    .use(baseLimiter)
    .use(express.json({ limit: "50kb" }))
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(cors({ origin: "http://localhost:5173", credentials: true }));

  app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  app.use(`${config.BASE_PATH}/v1`, v1Routes);

  app.use(errorHandler);

  return app;
};
