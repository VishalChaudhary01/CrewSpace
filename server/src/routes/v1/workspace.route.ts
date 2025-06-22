import { Router } from "express";

import {
  changeWorkspaceMemberRole,
  createWorkspace,
  deleteWorkspaceById,
  getAllWorkspacesUserIsMember,
  getWorkspaceAnalytics,
  getWorkspaceWithMembers,
  getWorkspaceMembers,
  updateWorkspaceById,
} from "@/controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/", createWorkspace);

workspaceRoutes.put("/:id", updateWorkspaceById);
workspaceRoutes.put("/change/member/role/:id", changeWorkspaceMemberRole);

workspaceRoutes.delete("/:id", deleteWorkspaceById);

workspaceRoutes.get("/all", getAllWorkspacesUserIsMember);
workspaceRoutes.get("/members/:id", getWorkspaceMembers);
workspaceRoutes.get("/analytics/:id", getWorkspaceAnalytics);
workspaceRoutes.get("/:id", getWorkspaceWithMembers);

export default workspaceRoutes;
