import { config } from 'dotenv';

const envFound = config({
  path: `./.env.${process.env.NODE_ENV || 'dev'}`,
});

if (!envFound) throw new Error("Couldn't find .env file");

export default {
  secret: process.env.JWT_SECRET,
  expired: process.env.JWT_EXPIRED,
};
