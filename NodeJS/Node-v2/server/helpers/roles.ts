import commons from '../commons/enum';

export default {
  setRoles(rider = '0', staff = '0', admin = '0', charger = '0') {
    let roles = '0000000000000000'; // Rider, Staff, Admin, Charger,.........
    roles =
      roles.substr(0, commons.userType.Rider) +
      rider +
      roles.substr(commons.userType.Rider + 1);
    roles =
      roles.substr(0, commons.userType.Staff) +
      staff +
      roles.substr(commons.userType.Staff + 1);
    roles =
      roles.substr(0, commons.userType.Admin) +
      admin +
      roles.substr(commons.userType.Admin + 1);
    roles =
      roles.substr(0, commons.userType.Charger) +
      charger +
      roles.substr(commons.userType.Charger + 1);
    return roles;
  },
  editRoles(roleObj, roleStr) {
    const { rider, staff, admin, charger } = roleObj;
    let roles = roleStr; // Rider, Staff, Admin, Charger,.........
    if (rider) {
      roles =
        roles.substr(0, commons.userType.Rider) +
        rider +
        roles.substr(commons.userType.Rider + 1);
    }
    if (staff) {
      roles =
        roles.substr(0, commons.userType.Staff) +
        staff +
        roles.substr(commons.userType.Staff + 1);
    }
    if (admin) {
      roles =
        roles.substr(0, commons.userType.Admin) +
        admin +
        roles.substr(commons.userType.Admin + 1);
    }
    if (charger) {
      roles =
        roles.substr(0, commons.userType.Charger) +
        charger +
        roles.substr(commons.userType.Charger + 1);
    }
    return roles;
  },
  isInRole(userType, valueToCheck) {
    if (!valueToCheck) return false;
    return valueToCheck[userType] === '1';
  },
  isInRoleNew(role, valueToCheck) {
    if (!valueToCheck) return false;

    if (role === 'rider') {
      return valueToCheck[commons.userType.Rider] === '1';
    }

    if (role === 'staff') {
      return valueToCheck[commons.userType.Staff] === '1';
    }

    if (role === 'admin') {
      return valueToCheck[commons.userType.Admin] === '1';
    }

    if (role === 'charger') {
      return valueToCheck[commons.userType.Charger] === '1';
    }

    return false;
  },
  getAllRole(valueToCheck) {
    const roles = {};
    Object.keys(commons.userType).forEach(key => {
      roles[`is${key}`] = valueToCheck[commons.userType[key]] === '1';
    });
    return roles;
  }
};
