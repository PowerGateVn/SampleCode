import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import config from '../../config';

const saltConfig = bcrypt.genSaltSync(parseInt(config.salt));
const users = [
  {
    id: uuid(),
    email: 'admin@ridebeam',
    phoneNumber: '0988777888'
  },
  {
    id: uuid(),
    email: 'staff@ridebeam',
    phoneNumber: '0978876666'
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
