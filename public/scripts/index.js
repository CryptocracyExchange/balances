const client = deepstream('localhost:6020').login();

const inputUser = document.querySelector('input.user');
const inputAmount = document.querySelector('input.amount');
const inputCurrency = document.querySelector('input.currency');

inputUser.onkeyup = (() => {
  record.set('user', inputUser.value);
});

inputAmount.onkeyup = (() => {
  record.set('amount', inputAmount.value);
});

inputCurrency.onkeyup = (() => {
  record.set('currency', inputCurrency.value);
});


