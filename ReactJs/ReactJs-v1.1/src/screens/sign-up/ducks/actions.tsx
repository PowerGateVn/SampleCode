import { IUserModel } from "models";
import { createActions } from "redux-actions";

const actions = createActions({
  SIGN_UP_ACTION: (userModel: IUserModel) => userModel
});

export const { signUpAction } = actions;
