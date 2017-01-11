FROM node:7.4-alpine

ENV DEEPSTREAM_AUTH_ROLE=provider \
    DEEPSTREAM_AUTH_USERNAME=balances-service

RUN mkdir /usr/local/balances
WORKDIR /usr/local/balances
COPY . /usr/local/balances
RUN npm install

CMD [ "npm", "run", "start-prod"]
