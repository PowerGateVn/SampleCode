import helper from '../../helpers/roles';
import InternalServerError from '../../errors/httpErrors/InternalServerError';
import assert from 'assert';
import enums from '../../commons/enum';

const { editRoles, isInRoleNew } = helper;

const fieldMapper = {
  [enums.roles.USER_RIDER]: 'rider',
  [enums.roles.USER_STAFF]: 'staff',
  [enums.roles.USER_ADMIN]: 'admin',
  [enums.roles.USER_CHARGER]: 'charger',
  /**
   * only one function to edit binary roles exists.
   * There is no point in refactoring it (this is an abstraction layer over it).
   * It is used a second time, and the "rider" and "staff" below
   * refer to the bit number for substitution (0 and 1).
   */
  [enums.roles.ACCOUNT_ADMIN]: 'rider',
  [enums.roles.ACCOUNT_STAFF]: 'staff'
};

const isUser = user => {
  return !!user.userType;
};

const tryParseJson = json => {
  let result = null;
  try {
    if (!Number.isNaN(parseFloat(json)) && Number.isFinite(json)) {
      throw new SyntaxError('Unexpected number instead of JSON');
    }
    result = JSON.parse(json);
  } catch (error) {
    if (!(error instanceof SyntaxError) || !error.message.includes('JSON')) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }
  return result;
};

const getRoleForUser = user => {
  if (user.hasRole(enums.roles.USER_ADMIN)) {
    return enums.roles.USER_ADMIN;
  }

  if (user.hasRole(enums.roles.USER_CHARGER)) {
    return enums.roles.USER_CHARGER;
  }

  if (user.hasRole(enums.roles.USER_RIDER)) {
    return enums.roles.USER_RIDER;
  }

  if (user.hasRole(enums.roles.USER_STAFF)) {
    return enums.roles.USER_STAFF;
  }

  throw new InternalServerError(`User with id: ${user.id} doesn't have a role`);
};

const getRoleForAccount = account => {
  if (account.hasRole(enums.roles.ACCOUNT_ADMIN)) {
    return enums.roles.ACCOUNT_ADMIN;
  }

  if (account.hasRole(enums.roles.ACCOUNT_STAFF)) {
    return enums.roles.ACCOUNT_STAFF;
  }

  throw new InternalServerError(
    `Account with id: ${account.id} doesn't have a role`
  );
};

export default class UserInstance {
  entities: any;
  countryCode: any;
  phoneNumber: any;

  addRole(role) {
    assert(
      Object.prototype.hasOwnProperty.call(fieldMapper, role),
      `Role ${role} does not exists. Available options are: [${Object.keys(
        fieldMapper
      ).join(', ')}]`
    );

    const fieldName = isUser(this) ? 'userType' : 'accountType';

    this[fieldName] = editRoles(
      {
        [fieldMapper[role]]: '1'
      },
      this[fieldName]
    );
  }

  getRole() {
    if (isUser(this)) {
      return getRoleForUser(this);
    }

    return getRoleForAccount(this);
  }

  hasRole(role) {
    assert(
      Object.prototype.hasOwnProperty.call(fieldMapper, role),
      `Role ${role} does not exists. Available options are: [${Object.keys(
        fieldMapper
      ).join(', ')}]`
    );

    const fieldName = isUser(this) ? 'userType' : 'accountType';
    return isInRoleNew(fieldMapper[role], this[fieldName]);
  }

  removeRole(role) {
    assert(
      Object.prototype.hasOwnProperty.call(fieldMapper, role),
      `Role ${role} does not exists. Available options are: [${Object.keys(
        fieldMapper
      ).join(', ')}]`
    );

    const fieldName = isUser(this) ? 'userType' : 'accountType';

    this[fieldName] = editRoles(
      {
        [fieldMapper[role]]: '0'
      },
      this[fieldName]
    );
  }

  isUser() {
    return isUser(this);
  }

  isAccount() {
    return !isUser(this);
  }

  setEntities(entities) {
    assert(Array.isArray(entities), 'Entities should be an array');
    this.entities = JSON.stringify([...entities]);
  }

  addEntities(entities) {
    assert(Array.isArray(entities), 'Entities should be an array');

    const userEntities = tryParseJson(this.entities);
    if (!userEntities) {
      this.entities = JSON.stringify([...entities]);
    } else {
      this.entities = JSON.stringify([...userEntities, ...entities]);
    }
  }

  getEntities() {
    const entities = tryParseJson(this.entities);
    if (entities) {
      return entities;
    }

    return [];
  }

  getEntityName(preferredEntityName) {
    const userEntities = tryParseJson(this.entities);

    if (!userEntities) {
      return null;
    }

    return preferredEntityName && userEntities.includes(preferredEntityName)
      ? preferredEntityName
      : userEntities[userEntities.length - 1];
  }

  getLastAwardedTrip(sequelize) {
    return async function() {
      // @ts-ignore
      const userId = this.id;

      const [trip] = await sequelize.models.Trip.findAll({
        where: {
          rewardedAt: {
            ne: null
          },
          userId
        },
        order: [['rewardedAt', 'DESC']],
        limit: 1
      });

      return trip;
    };
  }

  getFullPhoneNumber() {
    if (!this.countryCode || !this.phoneNumber) {
      return null;
    }
    return `${this.countryCode}${this.phoneNumber}`;
  }
}
