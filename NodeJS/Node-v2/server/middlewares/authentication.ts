import passport from 'passport';
import UnauthorizedError from '../errors/httpErrors/UnauthorizedError';
import ForbiddenError from '../errors/httpErrors/ForbiddenError';

export default (options: any = {}) => (req, res, next) => {
  passport.authenticate('jwt', options, (error, user, info) => {
    if (error || !user) {
      return next(new UnauthorizedError());
    }

    if (user.isBlocked) {
      return next(new ForbiddenError(user.blockReason));
    }

    req.user = user.dataValues;
    res.locals = res.locals || {};
    res.locals.user = user;

    return next();
  })(req, res, next);
};
