const events = require('./balances');

if (process.env.NODE_ENV !== 'prod') {
  const express = require('express');
  const path = require('path');
  const morgan = require('morgan');
  
  const app = express();
  app.use(morgan('combined'));
  app.use('/', express.static(path.join(__dirname, '../public')));

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });
}

const deepstream = require('deepstream.io-client-js');

const url = process.env.NODE_ENV === 'prod' ? 'deepstream' : 'localhost';
const client = deepstream(`${url}:6020`);
const auth = process.env.NODE_ENV === 'prod' ? {
  role: process.env.DEEPSTREAM_AUTH_ROLE,
  username: process.env.DEEPSTREAM_AUTH_USERNAME,
  password: process.env.DEEPSTREAM_AUTH_PASSWORD,
} : {};
client.login(auth);

events.checkBalance(client);
events.updateBalance(client);
