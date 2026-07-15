import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createFirstAdminSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const getAdminSetupStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSetupStatusServer } = await import("./admin-setup.server");
  return getAdminSetupStatusServer();
});

export const createFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((input) => createFirstAdminSchema.parse(input))
  .handler(async ({ data }) => {
    const { createFirstAdminServer } = await import("./admin-setup.server");
    return createFirstAdminServer(data);
  });