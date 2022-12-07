import { takeEvery } from "redux-saga/effects";
import { DE, IN } from "../actions/detail/detail.actionType";

export function* hello() {
    console.log("Hello PG");
}

export function* watchIncrement() {
    yield takeEvery(IN, () => {
        console.log("This is increment");
    });
}

export function* watchDecrement() {
    yield takeEvery(DE, () => {
        console.log("This is decrement");
    });
}