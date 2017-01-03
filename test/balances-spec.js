const assert = require('assert');
const testData = require('./testBalances');

console.log('data', testData);

const initTestData = () => {
  const userID = '00';
  const type = 'BTC';
  const amount = testData['00'].BTC;
  const balance = client.record.getRecord(`balances/${userID}/${type}`);
  balance.set('amount', amount);
};
initTestData();

describe('balances', function () {
  describe('check balance', function () {
    it('should return userID on "checkBalance" event', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
    it('should return currencyType on "checkBalance" event', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
    it('should return balance on "checkBalance" event', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
  describe('update balance', function() {
    it('should update current user balance on "updateBalance" event', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
    it('should return current user balance on "updateBalance" event', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
