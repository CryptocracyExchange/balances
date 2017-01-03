const client = deepstream('localhost:6020').login(); // eslint-no-undef

const inputUser = document.querySelector('input.user');
const inputAmount = document.querySelector('input.amount');
const inputCurrency = document.querySelector('input.currency');

let options = {};

inputUser.onkeyup = (() => {
  options.userID = inputUser.value;
});

inputAmount.onkeyup = (() => {
  options.amount = inputAmount.value;
});

inputCurrency.onkeyup = (() => {
  options.currency = inputCurrency.value.toUpperCase();
});

// create functions for buttons to emit events 'checkBalance' & 'updateBalance'
const checkBalance = () => {
  console.log('options', options);
  client.event.emit('checkBalance', options)
}

const updateBalance = () => {  
  console.log('options', options);
  client.event.emit('updateBalance', options)
}

// record names: 'balances/${userID}/${type}'

const balanceListener = () => {
  client.event.subscribe('returnBalance', (data) => {
    console.log('user balance is', data)
  })
}

balanceListener();
