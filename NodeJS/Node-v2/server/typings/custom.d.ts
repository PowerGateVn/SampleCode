/* eslint-disable */
// Twilio brought @types/express meaning that all reqs are typed with Request class
declare namespace Express {
  export interface Request {
    user?: any;
  }
}
