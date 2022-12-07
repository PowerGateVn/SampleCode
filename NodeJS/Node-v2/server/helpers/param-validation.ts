import Joi from 'joi';

export default {
  requestPhoneVerification: {
    body: {
      phoneNumber: Joi.string().required(),
      countryCode: Joi.string().required()
    }
  },
  verifyPhoneToken: {
    body: {
      phoneNumber: Joi.string().required(),
      countryCode: Joi.string().required(),
      code: Joi.string().required()
    }
  },
  signUp: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      countryCode: Joi.string().required(),
      email: Joi.string()
        .email()
        .allow('')
        .optional()
    }
  },
  settings: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .allow('')
        .optional()
    }
  },
  cancelOrRefund: {
    body: {
      tripId: Joi.number().required(),
      userId: Joi.number().required()
    }
  },
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  setUpVehicle: {
    body: {
      serialNumber: Joi.string()
        .required()
        .max(20),
      assetTrackerId: Joi.string()
        .optional()
        .max(20)
        .allow(''),
      code: Joi.string()
        .required()
        .max(10),
      omniIotImei: Joi.string()
        .optional()
        .length(15)
        .allow('')
    }
  },
  setUpPromoCode: {
    body: {
      name: Joi.string().required(),
      creditAmount: Joi.number().required(),
      creditCurrency: Joi.string().required(),
      geoRegionId: Joi.number().required()
    }
  },
  isInGeofence: {
    query: {
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      bufferDistance: Joi.number().optional()
    }
  }
};
