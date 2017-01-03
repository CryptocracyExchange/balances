const url = 'localhost:6020';
const deepstream = require('deepstream.io-client-js');
const client = deepstream(url).login();
const Big = require('big.js');
const testData = require('../test/testBalances');

const initTestData = () => {
  const userID = '00';
  const type = 'BTC';
  const amount = testData['00'].BTC;
  const balance = client.record.getRecord(`balances/${userID}/${type}`);
  balance.set('amount', amount);
};

initTestData();

module.exports.checkBalance = () => {
  // need some kind of error handling
  client.event.subscribe('checkBalance', (data) => {
    const balance = client.record.getRecord(`balances/${data.userID}/${data.currency}`);
    balance.whenReady(balance => {
      data.amount = balance.get('amount');
      if (!data.amount) {
        data.amount = 0;
        balance.set('amount', data.amount);
      }
      client.event.emit('returnBalance', data);
    });
    balance.discard();
  });
};

module.exports.updateBalance = () => {
  client.event.subscribe('updateBalance', (data) => {
    if (!data.update) {
      console.log('no defined change');
      data.update = '0';
    }
    const balance = client.record.getRecord(`balances/${data.userID}/${data.currency}`);
    balance.whenReady(balance => {
      const change = data.update;
      const amount = Big(balance.get('amount')).plus(change);
      balance.set('amount', amount);
      data.amount = Number(amount);
      client.event.emit('returnBalance', data);
    })
    balance.discard();
  });
};
