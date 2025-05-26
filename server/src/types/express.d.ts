import { UserDocument } from "@models/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        currentWorkspace: string;
      };
    }
  }
}

export {};
