import "module-alias/register";
import app from "./app";
import config from "./config";
import { logger } from "./middleware";

app.listen(config.port, () =>
  logger.info(
    `Server listening on port ${config.port} - env: ${process.env.NODE_ENV}`
  )
);

export { app };
