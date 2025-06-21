import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./route-path";

import { EmailVerificationPage } from "@/pages/auth/email-verification";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password.page";
import { ResetPasswordPage } from "@/pages/auth/reset-password";
import { SignInPage } from "@/pages/auth/signin.page";
import { SignUpPage } from "@/pages/auth/signup.page";
import { InvitePage } from "@/pages/invite/invite.page";
import { WorkspaceDashboardPage } from "@/pages/workspace/dashboard.page";
import { MembersPage } from "@/pages/workspace/members.page";
import { ProjectDetailsPage } from "@/pages/workspace/project-details.page";
import { SettingsPage } from "@/pages/workspace/settings.page";
import { TasksPage } from "@/pages/workspace/tasks.page";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignInPage /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUpPage /> },
  { path: AUTH_ROUTES.EMAIL_VERIFICATION, element: <EmailVerificationPage /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: AUTH_ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboardPage /> },
  { path: PROTECTED_ROUTES.TASKS, element: <TasksPage /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <MembersPage /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <SettingsPage /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetailsPage /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InvitePage /> },
];
