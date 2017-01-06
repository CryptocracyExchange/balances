const url = 'localhost:6020';
const deepstream = require('deepstream.io-client-js');
const client = deepstream(url).login();
const Big = require('big.js');
const testData = require('../test/testBalances');

// delete me - test data ///////////////////////////////////////////////////
const initTestData = () => {
  const userID = '00';
  const type = 'BTC';
  const amount = testData['00'].BTC;
  const balance = client.record.getRecord(`balances/${userID}`);
  balance.set(`${type}.amount`, amount);
};

initTestData();
// end of delete me ////////////////////////////////////////////////////////

/* checkBalance() 
 * Takes an object containing the desired unique userID ('userID')
 * and the currency type ('currency'). It then emits an event containing the same userID, currency type and the 
 * requested balance amount ('amount'). If no funds exist, creates record and sets to 0.
 */
module.exports.checkBalance = () => {
  client.event.subscribe('checkBalance', (data) => {
    const balance = client.record.getRecord(`balances/${data.userID}`);
    balance.whenReady(balance => {
      data.amount = balance.get(`${data.currency}.amount`);
      if (!data.amount) {
        data.amount = 0;
        balance.set(`${data.currency}.amount`, data.amount);
      }
      client.event.emit('returnBalance', data);
    });
    balance.discard();
  });
};

/* updateBalance() 
 * Takes an object containing the desired unique userID ('userID'), the increment of change ('update')
 * and the currency type ('currency'). It then emits an event containing the same userID, currency type and the 
 * updated balance amount ('amount'). If no 'update' is passed, defaults to 0.
 */
module.exports.updateBalance = () => {
  client.event.subscribe('updateBalance', (data) => {
    if (!data.update) {
      console.log('no defined change');
      data.update = '0';
    }
    const balance = client.record.getRecord(`balances/${data.userID}`);
    balance.whenReady(balance => {
      const change = data.update;
      const amount = Big(balance.get(`${data.currency}.amount`)).plus(change);
      balance.set(`${data.currency}.amount`, amount);
      data.amount = Number(amount);
      client.event.emit('returnBalance', data);
    })
    balance.discard();
  });
};
