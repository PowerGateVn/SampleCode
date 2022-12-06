import userView from '../views/user';

export default (req, res, next) => {
  res.locals.views = {
    userView
  };
  next();
};
