import { push } from "connected-react-router";
import { offLoadingAction, onLoadingAction } from "containers/redux/actions";
import { put, select, takeLatest } from "redux-saga/effects";
import { signUpAction } from "./actions";

function* signUpWatcher() {
  yield takeLatest(signUpAction, function*({ payload }) {
    try {
      yield put(onLoadingAction());
      console.log(payload, "payload");
      const router = yield select(state => state.router);
      console.log(router, "router");
      yield put(push("/sign-up/access-code"));
    } catch (error) {
      console.log(error);
    } finally {
      yield put(offLoadingAction());
    }
  });
}

export default { signUpWatcher };
