FROM node:7.4-alpine

WORKDIR /usr/local/balances
COPY . /usr/local/balances
RUN npm install

ENV DEEPSTREAM_AUTH_ROLE=provider \
    DEEPSTREAM_AUTH_USERNAME=balances-service

# Define default command.
CMD [ "npm", "run", "start-prod"]