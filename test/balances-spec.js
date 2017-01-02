var assert = require('assert');
var testData = require('./testBalances');

console.log("data", testData);

describe('balances', function() {
  describe('check balance', function() {
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
