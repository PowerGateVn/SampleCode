FROM keymetrics/pm2:10-alpine
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_PATH /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn --production --no-progress > /dev/null
RUN apk del .gyp
RUN yarn build
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
