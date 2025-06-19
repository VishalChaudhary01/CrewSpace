import "module-alias/register";
import { createServer } from "./create-server";
import { config } from "./config/env.config";
import { connectMongoDB } from "./config/mongoose.config";
import { seedRoles } from "./seeds/role.seed";
import { logger } from "./utils/logger";

const server = createServer();

server.listen(config.PORT, async () => {
  await connectMongoDB();
  await seedRoles();
  logger.info(
    `Server running at http://localhost:${config.PORT} in ${config.NODE_ENV}`,
  );
});
