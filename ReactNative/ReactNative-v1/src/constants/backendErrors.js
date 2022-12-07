import freeze from 'deep-freeze';

export const BackendErrorCodes = freeze({
  ConnectionFailed: 'ConnectionFailed',
});

export const BackendErrorMessages = freeze({
  ConnectionFailed: 'Server connection failed.',
});

export default BackendErrorCodes;
