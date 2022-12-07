import { handleActions } from "redux-actions";
import { offLoadingAction, onLoadingAction } from "./actions";
import IActionState from "./state";

export default handleActions<IActionState>(
  {
    [onLoadingAction.toString()]: state => ({ ...state, isLoading: true }),
    [offLoadingAction.toString()]: state => ({ ...state, isLoading: false })
  },
  {
    isLoading: false,
    errMess: null
  }
);
