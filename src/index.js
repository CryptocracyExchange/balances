const express = require('express');
const path = require('path');
const morgan = require('morgan');
const events = require('./balances');
const app = express();


app.use(morgan('combined'));
app.use('/', express.static(path.join(__dirname, '../public')));

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

events.checkBalance();
events.updateBalance();
