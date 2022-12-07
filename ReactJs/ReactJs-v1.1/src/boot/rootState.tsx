import { RouterState } from "connected-react-router";
import CommonActionState from "containers/redux/state";

export interface RootState {
  router: RouterState;
  common: CommonActionState;
}
