import freeze from 'deep-freeze';

export const Permissions = freeze({
  Location: 'location',
  PushNotifications: 'pushNotifications',
});

export const PermissionStates = freeze({
  NotSet: 'undetermined',
  Granted: 'authorized',
  Rejected: 'denied',
  Restricted: 'restricted',
});
