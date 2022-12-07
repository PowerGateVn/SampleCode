import { all } from "redux-saga/effects";
import { hello, watchDecrement, watchIncrement } from "./detail.saga";

export default function* rootSaga(){
    yield all([
        hello(),
        watchDecrement(),
        watchIncrement()
    ]);
}