export const getBody = (event: any) => {
  try {
    return JSON.parse(event?.body);
  } catch (e) {
    return {};
  }
};

export const getQuery = (event: any) => {
  try {
    return event.queryStringParameters;
  } catch (e) {
    return null;
  }
};
