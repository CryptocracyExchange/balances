const Big = require('big.js');

/* checkBalance()
 * Takes an object containing the desired unique userID ('userID')
 * and the currency type ('currency'). It then emits an event containing the same userID, currency type and the
 * requested balance amount ('balance'). If no funds exist, creates record and sets to 0.
 */
module.exports.checkBalance = (client) => {
  client.event.subscribe('checkBalance', (data) => {
    const balanceRecord = client.record.getRecord(`balances/${data.userID}`);
    balanceRecord.whenReady(balance => {
      data.balance = +balanceRecord.get(`${data.currency}.balance`);

      if (!data.balance) {
        data.balance = 0;
        balanceRecord.set(`${data.currency}.balance`, data.balance);
      }
      client.event.emit('returnBalance', data);
    });
    balanceRecord.discard();
  });
};

/* updateBalance()
 * Takes an object containing the desired unique userID ('userID'), the increment of change ('update')
 * and the currency type ('currency'). It then emits an event containing the same userID, currency type and the 
 * updated balance amount ('balance'). If no 'update' is passed, defaults to 0.
 */
module.exports.updateBalance = (client) => {
  client.event.subscribe('updateBalance', (data) => {
    if (!data.update) {
      console.log('no defined change');
      data.update = '0';
    }
    const balanceRecord = client.record.getRecord(`balances/${data.userID}`);
    balanceRecord.whenReady(balanceRecord => {
      const change = data.update;
      const balance = Big(balanceRecord.get(`${data.currency}.balance`)).plus(change);
      balanceRecord.set(`${data.currency}.balance`, balance);
      data.balance = +balance;
      client.event.emit('returnBalance', data);
      data.update = 0;
    });
    balanceRecord.discard();
  });
};
