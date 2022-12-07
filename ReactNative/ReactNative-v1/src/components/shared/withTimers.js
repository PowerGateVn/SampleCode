import React from 'react';
import {hoistStatics, wrapDisplayName} from 'recompose';

import Timers from './Timers';

const withTimers = (WrappedComponent) => {
  const C = function(props) {
    return (
      <Timers
        render={timers => (
          <WrappedComponent {...props} timers={timers} />
        )}
      />
    );
  };
  C.displayName = wrapDisplayName(WrappedComponent, 'withTimers');
  C.WrappedComponent = WrappedComponent;
  return hoistStatics(C, WrappedComponent);
};

export default withTimers;
