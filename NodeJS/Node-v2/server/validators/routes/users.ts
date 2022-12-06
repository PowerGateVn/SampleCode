import Joi from 'joi';

export default {
  update: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .allow('')
        .optional()
    }
  },
  updateAppRated: {
    body: {
      appRated: Joi.boolean().required()
    }
  },
  updateConfirmChargeTerm: {
    body: {
      chargerConfirmedTerms: Joi.boolean().required()
    }
  },
  updateRiderConfirmTerms: {
    body: {
      riderConfirmedTerms: Joi.boolean().required()
    }
  },
  addOrRemoveCharger: {
    body: {
      countryCode: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      associatedChargerGeoRegionId: Joi.number().required(),
      type: Joi.number().required()
    }
  }
};
