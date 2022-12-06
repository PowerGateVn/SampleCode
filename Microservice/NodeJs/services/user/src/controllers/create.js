import { success, failure } from '../../../../libs/response-lib';
import { createUser, sendVerificationMsg, sendViaKinesis } from '../businessLogic/user';

export async function main(event, context, callback) {
  try {
    const data = JSON.parse(event.body);
    const user = await createUser(data);
    if (!user) { return failure('create error'); }
    await sendVerificationMsg(user);
    return success(user);
  } catch (e) {
    return failure(e.messsage);
  }
};

export async function mainKinesis(event, context, callback) {
  try {
    const data = JSON.parse(event.body);
    const user = await createUser(data);
    if (!user) { return failure('create error'); }
    await sendViaKinesis(user);
    return success(user);
  } catch (e) {
    return failure(e.messsage);
  }
};
