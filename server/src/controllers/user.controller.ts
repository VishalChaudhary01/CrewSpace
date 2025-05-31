import { Request, Response } from "express";
import { logger } from "@/utils/logger";
import { StatusCode } from "@/config/http.config";
import { UnauthorizedError } from "@/errors/unauthorize.error";
import { getCurrentUserService } from "@/services/user.service";

// get user id utils
export const getUserId = (req: Request): string => {
  const userId = req.user?._id;
  if (!userId) {
    throw new UnauthorizedError("Unauthorize user");
  }
  return userId;
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const { user } = await getCurrentUserService(userId);

  logger.info(`Get current user: ${user._id}`);
  res.status(StatusCode.OK).json({
    message: "User fetch successfully",
    data: {
      user,
    },
  });
};
