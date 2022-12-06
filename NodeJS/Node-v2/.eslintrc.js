module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:import/typescript'
  ],
  plugins: ['no-only-tests'],
  rules: {
    'max-len': 0, // specify the maximum length of a line in your program (off by default)
    'no-eval': 0, // disallow use of eval()
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'none',
        ignoreRestSiblings: true
      }
    ], // disallow declaration of variables that are not used in the code
    radix: 0, // require use of the second argument for parseInt() (off by default)
    'class-methods-use-this': 0,
    'consistent-return': 0, // require return statements to either always or never specify values
    'linebreak-style': 0,
    'prefer-template': 0,
    'no-underscore-dangle': 0,
    'quote-props': 0,
    'dot-notation': 0,
    'object-shorthand': 0,
    'no-param-reassign': 0,
    camelcase: 0,
    'default-case': 0,
    'no-use-before-define': 0,
    'arrow-body-style': 0,
    'func-names': 0,
    'import/newline-after-import': 0,
    'padded-blocks': 0,
    'no-only-tests/no-only-tests': 2, // disallow tests with `.only`
    'no-unneeded-ternary': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'import/order': 0,
    'import/first': 0,
    'no-else-return': 0,
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true }
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['gulpfile.babel.js', 'server/tests/**/*.ts']
      }
    ]
  },
  settings: {
    "import/ignore": ['server/commons/enum.ts']
  }
};
