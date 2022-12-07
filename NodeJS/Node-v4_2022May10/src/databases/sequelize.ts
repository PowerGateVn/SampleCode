import { Sequelize } from "sequelize-typescript";

import DBConfig from "@src/config/db.config";
import { UserModel } from "@src/models/user.model";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: DBConfig.host,
  username: DBConfig.username,
  password: DBConfig.password,
  database: DBConfig.database,
  models: [UserModel],
  repositoryMode: true,
});
