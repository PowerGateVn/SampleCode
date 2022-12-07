import * as bcrypt from 'bcrypt';
import { HASH_LENGTH } from 'src/commons/constants/config.constants';

export const hashPassword = async (password: string): Promise<string> => {
  if (password) {
    return await bcrypt.hash(password, HASH_LENGTH);
  }

  return password;
};

export const comparePassword = async (
  password: string,
  hashText: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashText, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
