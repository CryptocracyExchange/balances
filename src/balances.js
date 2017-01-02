//balances deepstream service


const deepstream = require('deepstream.io-client-js');

const client = deepstream('localhost:6020').login();

module.exports.checkBalance = () => {
  client.event.subscribe('checkBalance', (data) => {
    console.log('checkBalance listener');
    let userID = data.userID;
    let type = data.currency;
    //client.record.getRecord('balances/${userID}/${type}');
  })
}


module.exports.updateBalance = () => {
  client.event.subscribe('updateBalance', (data) => {
    console.log('updateBalance listener');
    let userID = data.userID;
    let type = data.currency;
    //client.record.getRecord('balances/${userID}/${type}');
  })
}
