import faker from 'faker';
import roles from '../../helpers/roles';
import commons from '../../commons/enum';
import allModels from '../../models';

const generatePreRegisteredFakeUser = (id, phoneNumber) => {
  return {
    id,
    phoneNumber: phoneNumber,
    countryCode: '9999'
  };
};

const createUser = (
  {
    id = null,
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    email = faker.internet.email(),
    phoneNumber = faker.phone.phoneNumber('#########'),
    countryCode = '999',
    role = roles.setRoles('0', '0', '0', '0'),
    chargerConfirm = 0,
    riderConfirmedTerms = false,
    associatedChargerGeoRegionId = undefined,
    entities = undefined,
    isBlocked = false,
    blockReason = undefined
  },
  model
) => {
  const userAttributes = {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    countryCode,
    userType: role,
    chargerConfirmedTerms: chargerConfirm,
    riderConfirmedTerms,
    associatedChargerGeoRegionId,
    entities,
    isBlocked,
    blockReason
  };
  return model.create(userAttributes);
};

const emptyTables = async () => {
  // Destroy things in order before trying to destroy everything
  await allModels.User.destroy({
    where: {},
    force: true,
    cascade: true,
    truncate: true
  });

  await Promise.all(
    Object.keys(allModels).map(async model => {
      if (model !== 'Sequelize' && model !== 'sequelize') {
        await allModels[model].destroy({
          where: {},
          force: true
        });
      }
    })
  );
};
export {
  createUser,
  emptyTables
};
