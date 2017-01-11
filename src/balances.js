const Big = require('big.js');



module.exports.initBalance = (client) => {
  client.event.subscribe('initBalance', (data) => {
    const balanceRecord = client.record.getRecord(`balances/${data.userID}`);
    balanceRecord.whenReady(balance => {
      balance.set({
        'BTC': { available: 0, actual: 0 },
        'LTC': { available: 0, actual: 0 },
        'DOGE': { available: 0, actual: 0 }
      })
      console.log('initialized balances');
    })
    balanceRecord.discard();
  })
}

/* checkBalance()
 * Takes an object containing the desired unique userID ('userID')
 * and the currency type ('currency'). It then emits an event containing the same userID, currency type and the
 * requested balance amount ('balance'). If no funds exist, creates record and sets to 0.
 */
module.exports.checkBalance = (client) => {
  client.event.subscribe('checkBalance', (data) => {
    console.log('options', data);
    const balanceRecord = client.record.getRecord(`balances/${data.userID}`);
    balanceRecord.whenReady(balance => {
      console.log('bal', balance.get());
      data.balance = +balance.get(`${data.currency}.${data.balanceType}`);
      if (!data.balance) {
        data.balance = 0;
        balance.set(`${data.currency}.available`, +data.balance);
        balance.set(`${data.currency}.actual`, +data.balance);
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
      data.update = 0;
    }
    const balanceRecord = client.record.getRecord(`balances/${data.userID}`);
    balanceRecord.whenReady(balanceRecord => {
      const change = +data.update;
      let balance;
      if (data.isExternal === true) {
        balance = Big(balanceRecord.get(`${data.currency}.actual`)).plus(change);
        balanceRecord.set(`${data.currency}.actual`, +balance);
        balanceRecord.set(`${data.currency}.available`, +balance);
      } else {
        balance = Big(balanceRecord.get(`${data.currency}.${data.balanceType}`)).plus(change);
        balanceRecord.set(`${data.currency}.${data.balanceType}`, +balance);
      }
      data.balance = +balance;
      client.event.emit('returnBalance', data);
      data.update = 0;
    });
    balanceRecord.discard();
  });
};
