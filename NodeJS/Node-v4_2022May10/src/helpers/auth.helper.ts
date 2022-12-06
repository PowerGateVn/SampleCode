const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
import { StatusCodes } from "http-status-codes";
import { UserModel } from "@src/models/user.model";
import JWtConfig from "@src/config/jwt.config";

export const generateToken = (user: UserModel) => {
  const token = jwt.sign(
    {
      id: user.id,
      fullname: user.fullname,
    },
    JWtConfig.secret,
    {
      expiresIn: JWtConfig.expiredTime,
    }
  );

  return token;
};

export const getSafeUserInfo = (user: UserModel) => {
  return {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
  };
};

export const hasPassword = (password: string): string => {
  if (password) {
    return bcrypt.hash(password, 10);
  }

  return password;
};

export const comparePassword = (
  password: string,
  hasPassword: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hasPassword, (err: Error, result: boolean) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const verifyToken = (token: string): Promise<UserModel> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWtConfig.secret, (err: Error, user: UserModel) => {
      if (err || !user) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};
