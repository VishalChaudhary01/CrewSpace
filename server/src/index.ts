import "module-alias/register";
import { createServer } from "./create-server";
import { config } from "./config/env.config";
import { connectMongoDB } from "./config/mongoose.config";
import { seedRoles } from "./seeds/role.seed";

const server = createServer();

server.listen(config.PORT, async () => {
  await connectMongoDB();
  await seedRoles();
  console.log(
    `Server running at http://localhost:${config.PORT} in ${config.NODE_ENV}`,
  );
});
