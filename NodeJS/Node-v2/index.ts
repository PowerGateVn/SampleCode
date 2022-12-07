import Config from './config/index';
import RequestLogger from './server/commons/logger';
import { initializeProbe } from './server/middlewares/metrics';
import helpers from './server/helpers/helper';

import httpErrorHandler from './server/handlers/httpErrorHandler';
import validationErrorHandler from './server/handlers/validationErrorHandler';
import errorMiddleware from './server/middlewares/errors';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compress from 'compression';
import passport from 'passport';
import routes from './server/routes';
import passConfig from './server/helpers/passport-config';
import NotFoundError from './server/errors/httpErrors/NotFoundError';

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure passport for authentication
passConfig(passport);
app.use(passport.initialize());

// //Helps in decreasing the size of the response body and improve the speed of the API calls.
app.use(compress());
app.use(helmet());
// // enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Configure AWS X-Ray
if (Config.environment === 'production') {
  //app.use(AWSXRay.express.openSegment(`backend-api-${Config.xrayenv}`));
}
if (Config.environment === 'development') {
  app.use(RequestLogger());
}

app.use(initializeProbe());

// mount all routes on /api path
app.use('/api', routes);
app.use((req, res, next) => {
  next(new NotFoundError('Does Not Exist'));
});


app.use(httpErrorHandler);
app.use(validationErrorHandler);
app.use(errorMiddleware);
// Unexpected error handler;
app.use((error, req, res, next) => {
  helpers.logServerError(res, error);
});

if (Config.environment === 'production') {
  //app.use(AWSXRay.express.closeSegment());
}

app.listen(process.env.PORT || 4200, () => { });

module.exports = app;
export default app;
