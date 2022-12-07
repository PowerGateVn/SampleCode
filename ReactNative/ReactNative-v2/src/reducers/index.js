import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import DetailReducer from "./detail.reducer";

export default combineReducers({
	form: formReducer,
	detailReducer: DetailReducer
});