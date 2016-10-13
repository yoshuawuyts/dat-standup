FROM mhart/alpine-node:6
MAINTAINER Yoshua Wuyts <yoshuawuyts@gmail.com>

CMD "mkdir /app"
COPY . /app

WORKDIR /app

ENTRYPOINT ["node", "/app/index.js"]
