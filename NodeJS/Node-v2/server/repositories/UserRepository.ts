import enums from '../commons/enum';
import roles from '../helpers/roles';

const UserRepository = models => {
  const findById = id => {
    const condition = {
      where: {
        id
      }
    };
    return models.User.find(condition);
  };

  const findByEmail = email => {
    const condition = {
      where: {
        email: email.toLowerCase()
      }
    };

    return models.User.find(condition);
  };

  const findByPhone = (countryCode, phone) => {
    const condition = {
      where: {
        countryCode: countryCode,
        phoneNumber: phone
      }
    };

    return models.User.find(condition);
  };

  const findUserBySearchTerm = (type, searchTerm, countryCode) => {
    switch (type) {
      case enums.searchType.byId: {
        return findById(searchTerm);
      }
      case enums.searchType.byPhoneNumber: {
        return findByPhone(countryCode, searchTerm);
      }
      case enums.searchType.byEmail: {
        return findByEmail(searchTerm);
      }
      default:
        return null;
    }
  };

  // TODO: refactor this to use individual findByEmail or findByPhone
  const findByPhoneOrEmail = (email, phoneNumber) => {
    const condition = email
      ? {
          where: {
            $or: [{ email: email }, { phoneNumber: phoneNumber }]
          }
        }
      : {
          where: {
            phoneNumber: phoneNumber
          }
        };
    return models.User.find(condition);
  };

  const create = (phoneNumber, firstName, lastName, email, countryCode) => {
    return models.User.create({
      firstName: firstName,
      lastName: lastName,
      email: email ? email.toLowerCase() : null,
      phoneNumber: phoneNumber,
      userType: roles.setRoles('1', '0', '0', '0'),
      countryCode: countryCode
    });
  };

  const createWithPhone = (countryCode, phoneNumber) => {
    return models.User.create({
      countryCode,
      phoneNumber: phoneNumber
    });
  };

  const update = (user, userData) => {
    return user.updateAttributes(userData);
  };

  const remove = userId => {
    return models.User.update(
      {
        deleted: true
      },
      { where: { id: userId, deleted: false } }
    );
  };

  return {
    findById,
    findByEmail,
    findByPhone,
    findUserBySearchTerm,
    findByPhoneOrEmail,
    create,
    createWithPhone,
    update,
    remove
  };
};

export default UserRepository;
