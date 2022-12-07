import { DE, IN } from "./detail.actionType";

const incrementAction = (step) => {
    return {
        type: IN,
        step
    };
};

const decrementAction = (step) => {
    return {
        type: DE,
        step
    };
};

export default {
    decrementAction,
    incrementAction
};