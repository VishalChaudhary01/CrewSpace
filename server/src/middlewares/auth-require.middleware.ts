import { Request, Response, NextFunction } from "express";

import { config } from "@/config/env.config";
import { UnauthorizedError } from "@/errors/unauthorize.error";
import { verifyJwt } from "@/utils/jwt";

export const authRequire = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.[config.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Authentication token not found");
    }

    const { payload, error } = verifyJwt<{
      userId: string;
    }>(token);

    if (error || !payload) {
      throw new UnauthorizedError("Invalid or expired authentication token");
    }

    req.user = {
      _id: payload.userId,
    };
    next();
  } catch (error) {
    next(error);
  }
};
