import invariant from 'invariant';
import PropTypes from 'prop-types';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
import {
  compose,
  getContext,
  hoistStatics,
  lifecycle,
  mapProps,
} from 'recompose';
import { bindActionCreators } from 'redux';

import defined from '~app/utils/defined';

export default (navName, NavigatorComponent, actions = {}) => {
  const { router, routeConfigs } = NavigatorComponent;
  invariant(defined(router), 'NavigatorComponent must have a router');

  const mapStateToProps = (state) => ({
    navState: state.nav[navName],
  });

  const mapDispatchToProps = dispatch => ({
    dispatch,
    ...bindActionCreators(actions, dispatch),
  });

  const mergeProps = (stateProps, {dispatch, ...actionProps}, ownProps) => ({
    ...ownProps,
    ...actionProps,
    // we explicitly throw away ownProps because we are wrapping a navigator
    // and don't want to pass anything special into it
    navigation: addNavigationHelpers({
      navName,
      parentNavigation: ownProps.navigation,
      state: stateProps.navState,
      // we must add "nav" explicitly here because we may not be dispatching
      // to the correct reducer
      dispatch: (payload) => {
        if (typeof payload === 'object') {
          payload = {nav: navName, ...payload};
        }
        return dispatch(payload);
      },
    }),
  });
  
  const enhance = hoistStatics(compose(
    getContext({
      navigation: PropTypes.object,
    }),
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
    // throw everything except the navigation prop before
    // sending props to the navigator to avoid any warnings from the navigator
    // like "this navigator has both navigation and container props"...
    mapProps(({navigation}) => ({navigation})),
  ));
  const NewComponent = enhance(NavigatorComponent);

  // explicitly delete the router, we don't want it to be treated as a child
  if (NewComponent.router === router) {
    delete NewComponent.router;
  }
  return NewComponent;
};
