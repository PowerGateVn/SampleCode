import jwt from 'jsonwebtoken';
import roles from '../../helpers/roles';
import faker from 'faker';

const generateFakeValues = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    countryCode: faker.address.countryCode(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber('#########')
  };
};

const generateDummyUserData = dummyInfo => {
  const {
    id,
    firstName,
    lastName,
    role,
    countryCode,
    phoneNumber,
    email,
    chargerConfirmedTerms
  } = dummyInfo;

  const dataFake = generateFakeValues();

  return {
    id: id,
    firstName: firstName ? firstName : dataFake.firstName,
    lastName: lastName ? lastName : dataFake.lastName,
    email: email ? email : dataFake.email,
    phoneNumber: phoneNumber ? phoneNumber : dataFake.phoneNumber,
    userType: role ? role : roles.setRoles('0', '0', '0', '0'),
    countryCode: countryCode ? countryCode : dataFake.countryCode,
    chargerConfirmedTerms: chargerConfirmedTerms ? chargerConfirmedTerms : 0
  };
};

const generateRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default {
  generateDummyUserData,
  generateFakeValues,
  generateRandomNumberInRange
};
