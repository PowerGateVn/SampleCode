import { v4 as uuidv4 } from 'uuid';
import jwtConfig from 'src/configs/jwt.config';

export const createRefreshToken = (): {
  token: string;
  expireDate: number;
} => {
  const expiredAt = new Date();
  expiredAt.setSeconds(
    expiredAt.getSeconds() + parseInt(jwtConfig.refreshTokenExpired),
  );

  return {
    token: uuidv4(),
    expireDate: expiredAt.getTime(),
  };
};

export const verifyRefreshToken = (refreshToken): boolean => {
  const currentTime = Date.now();
  return refreshToken.expireDate > currentTime;
};
