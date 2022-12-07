export default (actions, initialState = undefined) => {
    const self = (state = initialState, action) => {
      const handler = actions[action.type];
      let nextState = handler ? handler(state, action) : state;
      if (self.forwardingReducer) {
        nextState = self.forwardingReducer(nextState, action);
      }
      return nextState;
    };
    return self;
  };
  