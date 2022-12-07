function createThunkMiddleware(services) {
    return ({dispatch, getState}) => next => action => {
      if (typeof action === 'function') {
        return action({
          ...services,
          dispatch,
          getState,
        });
      }
  
      return next(action);
    };
  }
  
  export default createThunkMiddleware;
  