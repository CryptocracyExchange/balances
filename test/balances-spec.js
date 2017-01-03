const assert = require('assert');
const url = 'localhost:6020';
const deepstream = require('deepstream.io-client-js');
const client = deepstream(url).login();
// const Big = require('big.js');
const testData = require('./testBalances');
const balances = require('../src/balances');

console.log('data', testData);

// test data

const initTestData = () => {
  const userID = '00';
  const type = 'BTC';
  const amount = testData['00'].BTC;
  const balance = client.record.getRecord(`balances/${userID}/${type}`);
  balance.set('amount', amount);
};

initTestData();


// const balanceListener = () => {
//   return client.event.subscribe('returnBalance', (data) => {
//     return data
//   })
// }




describe('balances', function () {
  describe('checkBalance()', function () {
    it('should return balance on "checkBalance" event', function(done) {
      client.event.emit('checkBalance', {userID: '00', currency: 'BTC'});
      client.event.subscribe('returnBalance', (data) => {
        console.log('data', data);
        assert.equal(2.03, data.amount);
        done();
      })
    });
    // it('should return 0 on empty balance "checkBalance" event', function(done) {
    //   client.event.emit('checkBalance', {userID: '02', currency: 'BTC'});
    //   client.event.subscribe('returnBalance', (data) => {
    //     console.log('data', data);
    //     assert.equal(0, data.amount);
    //     done();
    //   })
    // });
  });
  describe('update balance', function() {
    it('should update current user balance on "updateBalance" event', function(done) {
      client.event.emit('updateBalance', {userID: '00', update: '2', currency: 'BTC'});
      setTimeout(() => {
        client.event.subscribe('returnBalance', function (data) {
          assert.equal(4.03, data.amount);
          done();
        })
      }, 1200)
    });
  });
});
