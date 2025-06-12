import { useParams } from "react-router-dom";

export const useWorkspaceId = () => {
  const { workspaceId } = useParams();

  return workspaceId as string;
};
