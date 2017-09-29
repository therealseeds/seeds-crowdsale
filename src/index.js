import express from "express";
import winston from "winston";
import config from "config";
import routes from "api/routes";

export const app = express();

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== "test") {
  app.listen(config.port, () => winston.info(`Listening port ${config.port}`));
}

routes(app);
