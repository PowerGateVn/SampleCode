import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../../config';

// Importing so it ends up in the final bundle
import './user';
//import './vehicle';

export default () => {
  const basename = path.basename(module.filename);
  const db: any = {};

  const sequelize = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
      host: config.database.host,
      dialect: config.database.dialect,
      pool: config.database.pool,
      logging: config.database.logging && global.loggerServer.debug
    }
  );

  fs.readdirSync(__dirname)
    .filter(
      file =>
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file !== 'index.ts' &&
        file !== 'index.js'
    )
    .forEach(file => {
      if (file.slice(-3) !== '.ts' && file.slice(-3) !== '.js') return;
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};
