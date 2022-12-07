import roles from '../helpers/roles';
import repositories from '../repositories';
import models from '../models';

const { User: UserRepository } = repositories;

async function findById(userId) {
  return UserRepository.findById(userId);
}

async function findByPhoneOrEmail(email, phoneNumber) {
  return UserRepository.findByPhoneOrEmail(email, phoneNumber);
}

async function findByIdIncludeAuthoriseDate(userId) {
  try {
    return models.User.find({
      where: {
        id: userId
      },
      include: [models.AuthoriseDate]
    });
  } catch (error) {
    global.loggerServer.error(error);
    return null;
  }
}

async function findByPhoneNumberAndCountryCode(phoneNumber, countryCode) {
  return UserRepository.findByPhone(countryCode, phoneNumber);
}

async function create(phoneNumber, firstName, lastName, email, countryCode) {
  return UserRepository.create(
    phoneNumber,
    firstName,
    lastName,
    email,
    countryCode
  );
}

async function update(user, userData) {
  return UserRepository.update(user, userData);
}

async function createWithPhone(countryCode, phoneNumber) {
  return UserRepository.createWithPhone(countryCode, phoneNumber);
}

async function saveUserInSignUpProcess(
  user,
  firstName,
  lastName,
  email,
  countryCode,
  location,
  imageURL = null
) {
  user.firstName = firstName;
  user.lastName = lastName;
  if (email) {
    user.email = email;
  }
  user.userType = roles.setRoles('1', '0', '0', '0');
  user.countryCode = countryCode;
  user.signUpLocation = location;

  const result = [user];

  if (imageURL) {
    const userRegistration = models.UserRegistration.build({
      drivingLicenseImageURL: imageURL,
      userId: user.id
    });
    result.push(userRegistration);
  }

  return result;
}

async function remove(userId) {
  return UserRepository.remove(userId);
}

export default {
  findByPhoneOrEmail,
  create,
  findByIdIncludeAuthoriseDate,
  findById,
  update,
  findByPhoneNumberAndCountryCode,
  createWithPhone,
  saveUserInSignUpProcess,
  remove
};
