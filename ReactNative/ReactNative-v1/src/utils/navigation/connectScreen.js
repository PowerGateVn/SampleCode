import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { compose, hoistStatics, lifecycle } from 'recompose';

function getCurrentRoute(state) {
  if (state.routes) {
    return getCurrentRoute(state.routes[state.index]);
  }
  return state;
}

function isScreenFocused(currentNav, appNav) {
  const { parentNavigation, state, navName } = currentNav;

  // check if the parent navigator is focused - if not then we are not
  // visible either
  if (parentNavigation && !isScreenFocused(parentNavigation, appNav)) {
    return false;
  }

  const focusedState = getCurrentRoute(appNav[navName]);
  return state === focusedState;
}

export default (Screen, actions={}) => {
  const mapStateToProps = (state) => ({
    appNavigation: state.nav,
  });

  // dismiss the keyboard any time a screen-level action is executed
  const mapDispatchToProps = (dispatch) => {
    const boundActions = {};
    Object.entries(actions)
      .forEach(([name, action]) => {
        boundActions[name] = (...args) => {
          Keyboard.dismiss();
          return dispatch(action(...args));
        };
      });
    return boundActions;
  };

  // pass a focused property into the screen based on whether we think
  // the screen is visible currently or not
  const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
      // pass the params in as props
      ...ownProps.navigation.state.params,
      ...ownProps,
      ...dispatchProps,
      navigationFocus: isScreenFocused(
        ownProps.navigation,
        stateProps.appNavigation,
      ),
    };
  };
  const enhance = hoistStatics(compose(
    connect(mapStateToProps, mapDispatchToProps, mergeProps),
    lifecycle({
      componentWillMount() {
        if (this.props.componentWillMount) {
          this.props.componentWillMount();
        }
      },
      componentWillUnmount() {
        if (this.props.componentWillUnmount) {
          this.props.componentWillUnmount();
        }
      },
    }),
  ));
  return enhance(Screen);
};
