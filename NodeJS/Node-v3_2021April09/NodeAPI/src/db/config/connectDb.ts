import { Sequelize } from "sequelize";
import * as config from "./";
const env = process.env.NODE_ENV || "development";

let sequelize: Sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);

export { sequelize };
