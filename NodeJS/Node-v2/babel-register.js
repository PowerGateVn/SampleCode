require('@babel/register')({
  extensions: ['.ts', '.js'],
  ignore: [/node_modules\/(?!newrelic)/],
  cache: false
});
