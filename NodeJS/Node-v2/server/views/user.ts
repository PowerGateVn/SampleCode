import assert from 'assert';
import {
  DEFAULT_GROUP,
  UPDATE_GROUP,
  USER_CHARGER_CONFIRMED_GROUP,
  USER_RIDER_CONFIRMED_GROUP,
  ADD_CHARGER,
  USER_NOT_FOUND,
  REMOVE_CHARGER,
  USER_NOT_MATCH_PHONENUMBER,
  USER_ALREADY_CHARGER,
  SUCCESS,
  SEARCH_TERM
} from './groups';

export default group => user => {
  const {
    id,
    firstName,
    lastName,
    userType,
    email,
    phoneNumber,
    countryCode,
    appRated,
    chargerConfirmedTerms,
    riderConfirmedTerms,
    termsAndConditionsLastUpdated,
    dateChargerAcceptedTermsAndConditions,
    dateRiderAcceptedTermsAndConditions,
    adminStatus,
    associatedChargerGeoRegionId,
    chargerStatus,
    isBlocked,
    blockReason
  } = user;

  switch (group) {
    case DEFAULT_GROUP:
      return {
        id,
        firstName,
        lastName,
        userType,
        email,
        phoneNumber,
        countryCode,
        associatedChargerGeoRegionId
      };

    case UPDATE_GROUP:
      return {
        id,
        firstName,
        lastName,
        userType,
        email,
        phoneNumber,
        countryCode,
        appRated
      };
    case SEARCH_TERM:
      return {
        id,
        adminStatus,
        chargerStatus,
        userType,
        associatedChargerGeoRegionId,
        phoneNumber,
        email,
        countryCode,
        isBlocked,
        blockReason
      };
    case SUCCESS: {
      return {
        success: true,
        message: user.message,
        response: {},
        error: '',
        data: {}
      };
    }
    case USER_CHARGER_CONFIRMED_GROUP:
      return {
        id,
        isConfirmChargerTerm: chargerConfirmedTerms,
        dateChargerAcceptedTermsAndConditions,
        termsAndConditionsLastUpdated
      };

    case USER_RIDER_CONFIRMED_GROUP:
      return {
        id,
        isRiderConfirmedTerms: riderConfirmedTerms,
        dateRiderAcceptedTermsAndConditions,
        termsAndConditionsLastUpdated
      };
    case ADD_CHARGER:
      return {
        success: true,
        message: user.message,
        response: {},
        error: '',
        data: {}
      };
    case REMOVE_CHARGER:
      return {
        success: true,
        message: user.message,
        response: {},
        error: '',
        data: {}
      };
    case USER_NOT_FOUND: {
      return {
        success: false,
        message: user.message,
        response: {},
        error: '',
        data: {}
      };
    }
    case USER_NOT_MATCH_PHONENUMBER: {
      return {
        success: false,
        message: user.message,
        response: {},
        error: '',
        data: {}
      };
    }
    case USER_ALREADY_CHARGER: {
      return {
        success: false,
        message: user.message,
        response: {},
        error: '',
        data: {}
      };
    }

    default:
      assert(false, `Group ${group} is invalid`);
  }
};
