export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/signup",
  EMAIL_VERIFICATION: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
};

export const PROTECTED_ROUTES = {
  WORKSPACE: "/workspace/:workspaceId",
  TASKS: "/workspace/:workspaceId/tasks",
  MEMBERS: "/workspace/:workspaceId/members",
  SETTINGS: "/workspace/:workspaceId/settings",
  PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
};

export const BASE_ROUTE = {
  INVITE_URL: "/invite/workspace/:inviteCode/join",
};

export const isAuthRoute = (pathname: string) => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};
