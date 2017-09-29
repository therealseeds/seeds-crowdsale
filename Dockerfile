FROM node:6.11.3

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /home/node/app

RUN chown -R node:node /home/node

COPY . /home/node/app
RUN npm install

RUN chown node:node /home/node/app -R
USER node

EXPOSE 8080

CMD npm start
