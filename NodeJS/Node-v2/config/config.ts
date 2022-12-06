export default {
  /**
   * Timezone setting for application
   * @type {String}
   */
  jwtExpiresIn: '20d',

  passportOptions: {
    session: false
  },

  modificationResponse: {
    capture: '[capture-received]',
    cancel: '[cancel-received]',
    refund: '[refund-received]',
    cancelOrRefund: '[cancelOrRefund-received]'
  },

  enableConnectionPool: process.env.enableConnectionPool


};
