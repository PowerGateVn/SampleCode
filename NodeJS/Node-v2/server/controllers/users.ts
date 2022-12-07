import messages from '../commons/message';
import helpers from '../helpers/helper';
import roles from '../helpers/roles';
import httpStatus from 'http-status/lib/index';
import NotFoundError from '../errors/httpErrors/NotFoundError';
import BadRequestError from '../errors/httpErrors/BadRequestError';
import commons from '../commons/enum';
import moment from 'moment';
import {
  DEFAULT_GROUP,
  UPDATE_GROUP,
  USER_CHARGER_CONFIRMED_GROUP,
  USER_RIDER_CONFIRMED_GROUP,
  ADD_CHARGER,
  REMOVE_CHARGER,
  USER_NOT_FOUND,
  USER_NOT_MATCH_PHONENUMBER,
  USER_NOT_A_CHARGER,
  USER_ALREADY_CHARGER,
  USER_REFERRAL_CODE
} from '../views/groups';

const checkIfUserExists = user => {
  if (!user) {
    throw new NotFoundError(
      messages.user.UserNotFound,
      'messages.user.UserNotFound'
    );
  }

  return user;
};

const checkIfEmailExists = (req, model) => user => {
  const { email } = req.body;

  if (!email) {
    return user;
  }

  return model.findByEmail(email).then(existedUser => {
    if (existedUser && existedUser.id !== user.id) {
      throw new BadRequestError(
        messages.user.EmailExisted(existedUser.email),
        'messages.user.EmailExisted',
        { email: existedUser.email }
      );
    }

    return user;
  });
};

const getCurrent = (req, res) => {
  const { userRepository } = res.locals.services;
  const { userView } = res.locals.views;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(user => {
      res.send(userView(DEFAULT_GROUP)(user));
    });
};

const updateCurrent = (req, res) => {
  const { userRepository } = res.locals.services;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(checkIfEmailExists(req, userRepository))
    .then(user => {
      const { firstName, lastName, email } = req.body;
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email === '' ? null : email.toLowerCase();

      return user.save().then(userUpdate => {
        return helpers.responseData(
          res,
          httpStatus.OK,
          true,
          messages.user.success,
          {},
          '',
          userUpdate
        );
      });
    });
};

const updateAppRated = (req, res) => {
  const { userRepository } = res.locals.services;
  const { userView } = res.locals.views;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(user => {
      const { appRated } = req.body;
      user.appRated = appRated;

      return user.save().then(updatedUser => {
        res.send(userView(UPDATE_GROUP)(updatedUser));
      });
    });
};

const getConfirmChargeTerm = (req, res) => {
  const { userRepository } = res.locals.services;
  const { userView } = res.locals.views;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(user => {
      user.termsAndConditionsLastUpdated = moment(
        commons.termsAndConditionsLastUpdated
      );
      res.send(userView(USER_CHARGER_CONFIRMED_GROUP)(user));
    });
};

const updateConfirmChargeTerm = (req, res) => {
  const { userRepository } = res.locals.services;
  const { userView } = res.locals.views;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(user => {
      const { chargerConfirmedTerms } = req.body;
      user.chargerConfirmedTerms = chargerConfirmedTerms;
      user.dateChargerAcceptedTermsAndConditions = new Date();

      return user.save().then(updatedUser => {
        res.send(userView(USER_CHARGER_CONFIRMED_GROUP)(updatedUser));
      });
    });
};

const getRiderConfirmedTerms = (req, res) => {
  const { userRepository } = res.locals.services;
  const { userView } = res.locals.views;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(user => {
      user.termsAndConditionsLastUpdated = moment(
        commons.termsAndConditionsLastUpdated
      );
      res.send(userView(USER_RIDER_CONFIRMED_GROUP)(user));
    });
};

const updateRiderConfirmedTerms = (req, res) => {
  const { userRepository } = res.locals.services;
  const { userView } = res.locals.views;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(user => {
      const { riderConfirmedTerms } = req.body;
      user.riderConfirmedTerms = riderConfirmedTerms;
      user.dateRiderAcceptedTermsAndConditions = new Date();

      return user.save().then(updatedUser => {
        res.send(userView(USER_RIDER_CONFIRMED_GROUP)(updatedUser));
      });
    });
};

const setUserAcceptConvenienceFeeTerms = (req, res) => {
  const { userRepository } = res.locals.services;
  return userRepository
    .findById(res.locals.user.id)
    .then(checkIfUserExists)
    .then(user => {
      user.dateAcceptedConvenienceFeeTerms = new Date();

      return user.save().then(updatedUser => {
        res.send('OK');
      });
    });
};

export default {
  getCurrent,
  updateCurrent,
  getConfirmChargeTerm,
  updateConfirmChargeTerm,
  updateAppRated,
  updateRiderConfirmedTerms,
  getRiderConfirmedTerms,
  setUserAcceptConvenienceFeeTerms
};
