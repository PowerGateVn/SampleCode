import passportJWT from 'passport-jwt';
import config from '../../config/index';
import modelsFactory from '../models/index';

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;

function passportConfiguration(passport, models = modelsFactory) {
  const opts: any = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  // opts.tokenQueryParameterName = ExtractJwt.fromUrlQueryParameter(auth_token);
  opts.secretOrKey = config.jwtSecret;
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, cb) => {
      if (Number(jwtPayload.id)) {
        const user = await models.User.find({
          where: {
            id: jwtPayload.id
          }
        });
        if (user) {
          cb(null, user);
        } else {
          cb(new Error('Some thing wrong in token'), false);
        }
      } else {
        const account = await models.Account.find({
          where: {
            id: jwtPayload.id
          }
        });
        if (account) {
          account.fromWebDashboard = true;
          cb(null, account);
        } else {
          cb(new Error('Some thing wrong in token'), false);
        }
      }
    })
  );
}

export default passportConfiguration;
