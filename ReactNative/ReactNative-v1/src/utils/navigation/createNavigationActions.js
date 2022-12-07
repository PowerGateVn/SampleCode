import { NavigationActions } from 'react-navigation';

// actions pulled from NavigationActions
const actionKeys = [
  'back',
  'init',
  'navigate',
  'reset',
  'setParams',
  'uri',
];

export default (navName) => {
  const result = {
    navName,
  };
  const addNavName = (key) => {
    const action = NavigationActions[key];
    return (payload) => action({nav: navName, ...payload});
  };

  actionKeys.forEach(key => result[key] = addNavName(key));

  return result;
};
