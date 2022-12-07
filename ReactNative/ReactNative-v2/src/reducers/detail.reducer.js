import { DE, IN } from "../actions/detail/detail.actionType";


const unState = {
    step: 0
};

const DetailReducer = (state = unState, action) => {
    switch (action.type) {
        case DE:
            return {
                ...state,
                step: state.step - action.step
            };
        case IN:
            return {
                ...state,
                step: state.step + action.step
            };
        default:
            return state;
    }
};

export default DetailReducer;