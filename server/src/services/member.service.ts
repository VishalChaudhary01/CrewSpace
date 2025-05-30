import { Roles } from "@/enums/role.enum";
import { RoleModel } from "@/models/role.model";
import { MemberModel } from "@/models/member.model";
import { WorkspaceModel } from "@/models/wrokspace.model";
import { getWorkspaceByIdService } from "./workspace.service";
import { NotFoundError } from "@/errors/not-found.error";
import { BadRequestError } from "@/errors/bad-request.error";
import { UnauthorizedError } from "@/errors/unauthorize.error";

export const getMemberRoleInWorkspaceService = async (
  userId: string,
  workspaceId: string,
) => {
  await getWorkspaceByIdService(workspaceId);

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");
  if (!member) {
    throw new UnauthorizedError("You are not a member of this workspace");
  }

  const roleName = member.role?.name;

  return { role: roleName };
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string,
) => {
  const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
  if (!workspace) {
    throw new NotFoundError("Invalid invite code or workspace not found");
  }

  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();
  if (existingMember) {
    throw new BadRequestError("You are already a member of this workspace");
  }

  const role = await RoleModel.findOne({ name: Roles.MEMBER });
  if (!role) {
    throw new NotFoundError("Role not found");
  }
  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });
  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
};
