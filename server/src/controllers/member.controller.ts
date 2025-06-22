import { Request, Response } from "express";

import { getUserId } from "./user.controller";

import { StatusCode } from "@/config/http.config";
import { joinWorkspaceByInviteService } from "@/services/member.service";
import { logger } from "@/utils/logger";
import { inviteCodeSchema } from "@/validators/common.validator";

export const joinWorkSpace = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const inviteCode = inviteCodeSchema.parse(req.params.inviteCode);

  logger.info(
    `User: ${userId} request to join workspace by invite code: ${inviteCode}`,
  );

  const { workspaceId, role } = await joinWorkspaceByInviteService(
    userId,
    inviteCode,
  );

  logger.info(
    `User: ${userId} joined workspace: ${workspaceId} as role: ${role}`,
  );

  res.status(StatusCode.OK).json({
    message: "Successfully joined the workspace",
    data: {
      workspaceId,
      role,
    },
  });
};
