import { all, fork } from "redux-saga/effects";
import screenSaga from "screens/screenSaga";

export default function* rootSaga() {
  yield all([...Object.values(screenSaga)].map(fork));
}
