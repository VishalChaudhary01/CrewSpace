import mongoose from "mongoose";
import { ProjectModel } from "@/models/project.model";
import {
  CreateProjectDto,
  UpdateProjectDto,
} from "@/validators/project.validator";
import { NotFoundError } from "@/errors/not-found.error";
import { TaskModel } from "@/models/task.model";
import { TaskStatus } from "@/enums/task.enum";
import { AppError } from "@/errors/app.error";

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  data: CreateProjectDto,
) => {
  const project = new ProjectModel({
    ...data,
    workspace: workspaceId,
    createdBy: userId,
  });
  await project.save();

  return { project };
};

export const getProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number,
) => {
  const skip = (pageNumber - 1) * pageSize;

  const [totalCount, projects] = await Promise.all([
    ProjectModel.countDocuments({ workspace: workspaceId }),
    ProjectModel.find({ workspace: workspaceId })
      .skip(skip)
      .limit(pageSize)
      .populate("createdBy", "_id name")
      .sort({ createdAt: -1 }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalCount, totalPages, skip };
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string,
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id name description");

  if (!project) {
    throw new NotFoundError(
      "Project not found or does not belong to the specified workspace",
    );
  }

  return { project };
};

export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string,
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundError(
      "Project not found or does not belong to this workspace",
    );
  }

  const currentDate = new Date();

  const taskAnalytics = await TaskModel.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: {
                $ne: TaskStatus.DONE,
              },
            },
          },
          {
            $count: "count",
          },
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatus.DONE,
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const _analytics = taskAnalytics[0];

  const analytics = {
    totalTasks: _analytics.totalTasks[0]?.count || 0,
    overdueTasks: _analytics.overdueTasks[0]?.count || 0,
    completedTasks: _analytics.completedTasks[0]?.count || 0,
  };

  return {
    analytics,
  };
};

export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  data: UpdateProjectDto,
) => {
  const { name, description } = data;
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });
  if (!project) {
    throw new NotFoundError(
      "Project not found or does not belong to the specified workspace",
    );
  }

  if (name) project.name = name;
  if (description) project.description = description;
  await project.save();

  return { project };
};

export const deleteProjectService = async (
  workspaceId: string,
  projectId: string,
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });
  if (!project) {
    throw new NotFoundError(
      "Project not found or does not belong to the specified workspace",
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await project.deleteOne().session(session);

    await TaskModel.deleteMany({
      project: project._id,
    }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new AppError("Filed to delete project");
  } finally {
    session.endSession();
  }

  return;
};
