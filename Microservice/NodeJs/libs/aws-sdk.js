import aws from "aws-sdk";

// Do not enable tracing for 'invoke local'
const awsWrapped = aws;
// const awsWrapped = process.env.IS_LOCAL ? aws : xray.captureAWS(aws);

export default awsWrapped;
