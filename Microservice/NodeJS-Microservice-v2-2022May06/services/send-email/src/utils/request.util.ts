export const getPayload = (event: any): any => {
  const [record] = event.Records;
  const payload = Buffer.from(record.kinesis.data, "base64").toString();
  return JSON.parse(payload);
};
