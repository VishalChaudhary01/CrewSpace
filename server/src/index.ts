import "module-alias/register";
import { createServer } from "./create-server";
import { config } from "./config/env.config";

const server = createServer();

server.listen(config.PORT, () =>
  console.log(
    `Server running at http://localhost:${config.PORT} in ${config.NODE_ENV}`,
  ),
);
