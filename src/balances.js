// balances deepstream service
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
  client.event.subscribe('checkBalance', (data) => {
    console.log('checkBalance listener', data);
    const userID = data.userID;
    const type = data.currency;
    const balance = client.record.getRecord(`balances/${userID}/${type}`);
    balance.whenReady(balance => {
      data.amount = balance.get('amount');
      client.event.emit('returnBalance', data);
    });
    balance.discard();
  });
};


module.exports.updateBalance = () => {
  client.event.subscribe('updateBalance', (data) => {
    console.log('updateBalance listener', data);
    const userID = data.userID;
    const type = data.currency;
    const change = data.amount;
    const balance = client.record.getRecord(`balances/${userID}/${type}`);
    balance.whenReady(balance => {
      const amount = Big(balance.get('amount')).plus(change);
      // console.log('am', amount + change)
      balance.set('amount', amount);
      data.amount = amount;
      client.event.emit('returnBalance', data);
    })
  });
};
