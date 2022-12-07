const cli = require('next/dist/cli/next-start');
const loadEnvConfig = require('./env');

loadEnvConfig();
cli.nextStart();
