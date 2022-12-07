export function emailAddress(input) {
  let result = null;
  if (!input || !input.length) {
    return { message: 'Required' };
  }
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(input)) {
    result = { message: 'Please provide a valid email address' };
  }
  return result;
}

export function required(input) {
  if (!input || !input.length) {
    return { message: 'Required' };
  }
  return null;
}
