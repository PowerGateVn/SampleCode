import fs from 'fs';
import path from 'path';

import db from '../models';

const query = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), {
  encoding: 'utf-8'
});

(async () => {
  try {
    await db.sequelize.query(query);
    console.log('Schema import successful');
  } catch (error) {
    console.error('Schema import failed: ', error);
  } finally {
    console.log('Closing db connection');
    db.sequelize.close();
  }
})();
