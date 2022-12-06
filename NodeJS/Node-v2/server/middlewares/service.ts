import userService from '../services/userService';
import roles from '../helpers/roles';
import repositories from '../repositories';

// These are generic services that do not need the user to be logged in
const withServices = (req, res, next) => {
  // alphabetacized services
  res.locals.services = {
    roles,
    persist: repositories.persist,
    userRepository: repositories.User,
    userService
  };

  next();
};

export default withServices;
