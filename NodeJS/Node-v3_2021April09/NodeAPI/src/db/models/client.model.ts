import { DataTypes } from "sequelize";
import MyModelStatic from ".";
import { sequelize } from "../config/connectDb";

export default <MyModelStatic>sequelize.define(
  "client",
  {
    clientId: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING({ length: 500 })
    },
    clientSecret: {
      type: DataTypes.TEXT
    }
  },
  {
    underscored: false,
    tableName: "client"
  }
);
