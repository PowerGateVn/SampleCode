import { success, failure } from '../../../../libs/response-lib';
export async function main(event, context, callback) {
    try {
      const user = { id:1, name:2};
      return success(user);
    } catch (e) {
      return failure(e.messsage);
    }
  };