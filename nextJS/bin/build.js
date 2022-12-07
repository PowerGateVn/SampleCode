const cli = require('next/dist/cli/next-build');
const loadEnvConfig = require('./env');

loadEnvConfig();
cli.nextBuild();
