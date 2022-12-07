import { handleActions } from "redux-actions";
import ISignUpState from "./state";

export default handleActions<ISignUpState>(
  {},
  {
    user: null
  }
);
