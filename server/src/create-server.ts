import express, { Request, Response } from "express";
import helmet from "helmet";

export const createServer = () => {
  const app = express();
  app
    .use(helmet())
    .use(express.json({ limit: "50kb" }))
    .use(express.urlencoded({ extended: true }));

  app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  return app;
};
