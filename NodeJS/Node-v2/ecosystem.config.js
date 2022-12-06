module.exports = {
  apps: [
    {
      name: 'api-server',
      script: 'dist/index.js',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART || '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      output: '/dev/null',
      error: '/dev/null'
    },
    {
      name: 'api-worker',
      script: 'dist/worker/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART || '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      output: '/dev/null',
      error: '/dev/null'
    }
  ]
};
