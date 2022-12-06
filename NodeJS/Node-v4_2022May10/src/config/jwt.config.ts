import "@src/helpers/env.helper";

export default {
  secret: process.env.JWT_SECRET,
  expiredTime: process.env.JWT_EXPIRED_TIME,
};
