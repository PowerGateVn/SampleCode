export const PERMISSIONS_CHANGED = 'PERMISSIONS_CHANGED';
export const REFRESH_PERMISSIONS = 'REFRESH_PERMISSIONS';
export const REQUEST_PERMISSION = 'REQUEST_PERMISSION';

export function refreshPermissions() {
  return {
    type: REFRESH_PERMISSIONS,
  };
}

export function updatePermissions(permissions) {
  return {
    type: PERMISSIONS_CHANGED,
    permissions,
  };
}

export function requestPermission(name) {
  return {
    type: REQUEST_PERMISSION,
    permission: name,
  };
}
