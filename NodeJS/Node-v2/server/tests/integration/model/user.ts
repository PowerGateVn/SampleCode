import { expect } from 'chai';
import { emptyTables, createUser } from '../../helpers/fixtures';
import modelFactory from '../../../models/index';

describe('User model', () => {
  const models = modelFactory;

  beforeEach('setUp', async () => {
    await emptyTables();
    return Promise.all([createUser({ id: 1 }, models.User)]);
  });

  after(async () => {
    await emptyTables();
  });

  it('finds user by id', () => {
    return models.User.findById(1).then(user => {
      expect(user).to.not.be.null;
    });
  });

  it('finds non existent user by id', () => {
    const invalidId = 100000;
    return models.User.findById(invalidId).then(user => {
      expect(user).to.be.null;
    });
  });
});
