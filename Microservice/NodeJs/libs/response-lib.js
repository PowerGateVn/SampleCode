export function success(body) {
  return buildResponse(200, body);
}

export function failure(message) {
  const body = {
    status: false,
    message
  };
  return buildResponse(500, body);
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}
