import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { LoginPage } from "./LoginPage";

const LoginQueryParamsSchema = z.object({
  callback_port: z.coerce.number().optional().catch(undefined),
  force: z.string().optional().catch(undefined),
  org_id: z.string().optional().catch(undefined),
  invite_signup_disabled: z.string().optional().catch(undefined)
});

export const Route = createFileRoute("/_restrict-login-signup/login/")({
  component: LoginPage,
  validateSearch: zodValidator(LoginQueryParamsSchema)
});
