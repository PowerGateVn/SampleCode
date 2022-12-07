import userController from '../controllers/users';
import config from '../../config/index';
import userValidation from '../validators/routes/users';
import validate from 'express-validation';
import authentication from '../middlewares/authentication';
import wrap from './wrap';
import { trackMetric } from '../middlewares/metrics';
import withServices from '../middlewares/service';
import withViews from '../middlewares/view';

// eslint-disable-next-line import/prefer-default-export
export const decorator = router => {
  router.all('/users/', authentication(config.passportOptions));
  router.all('/users/*', authentication(config.passportOptions));

  router
    .get(
      '/users/',
      trackMetric('get-user'),
      withServices,
      withViews,
      wrap(userController.getCurrent)
    )
    .put(
      '/users/',
      trackMetric('update-user'),
      validate(userValidation.update),
      withServices,
      withViews,
      wrap(userController.updateCurrent)
    )
    .post(
      '/users/updateAppRated',
      trackMetric('update-app-rated'),
      validate(userValidation.updateAppRated),
      withServices,
      withViews,
      wrap(userController.updateAppRated)
    )
    .get(
      '/users/getConfirmChargeTerm',
      trackMetric('get-confirm-charge-term'),
      withServices,
      withViews,
      wrap(userController.getConfirmChargeTerm)
    )
    .post(
      '/users/updateConfirmChargeTerm',
      trackMetric('update-confirm-charge-term'),
      validate(userValidation.updateConfirmChargeTerm),
      withServices,
      withViews,
      wrap(userController.updateConfirmChargeTerm)
    )
    .get(
      '/users/getRiderConfirmedTerms',
      trackMetric('get-confirm-rider-term'),
      withServices,
      withViews,
      wrap(userController.getRiderConfirmedTerms)
    )
    .post(
      '/users/updateRiderConfirmedTerms',
      trackMetric('update-confirm-rider-term'),
      validate(userValidation.updateRiderConfirmTerms),
      withServices,
      withViews,
      wrap(userController.updateRiderConfirmedTerms)
    )
    .post(
      '/users/acceptConvenienceFeeTerms',
      trackMetric('accept-convenience-fee-terms'),
      withServices,
      withViews,
      wrap(userController.setUserAcceptConvenienceFeeTerms)
    );
};
