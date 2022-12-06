import UserRepository from './UserRepository';

import models from '../models';

const persist = async entities => {
  const transaction = await models.sequelize.transaction();
  try {
    await Promise.all(entities.map(entity => entity.save({ transaction })));

    return transaction.commit();
  } catch (error) {
    global.loggerServer.error(`Error when persisting entities: ${entities}`);

    return transaction.rollback();
  }
};

const repositories = {
  User: UserRepository(models),
  persist
};

export default repositories;
