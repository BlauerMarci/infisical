import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { LoginPage } from "./LoginPage";

// DIESES SCHEMA SAGT DEM ROUTER, WELCHE URL-PARAMETER ERLAUBT SIND
const LoginQueryParamsSchema = z.object({
  callback_port: z.coerce.number().optional().catch(undefined),
  force: z.string().optional().catch(undefined),
  org_id: z.string().optional().catch(undefined),
  // UNSER NEUER PARAMETER (wird als String "true" aus der URL gelesen)
  invite_signup_disabled: z.string().optional().catch(undefined)
});

export const Route = createFileRoute("/_restrict-login-signup/login/")({
  component: LoginPage,
  // Hier hängen wir das Schema an die Route
  validateSearch: zodValidator(LoginQueryParamsSchema)
});
