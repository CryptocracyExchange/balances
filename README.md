# balances
[![CircleCI](https://circleci.com/gh/CryptocracyExchange/balances.svg?style=svg)](https://circleci.com/gh/CryptocracyExchange/balances)

## API Contract ##
* checkBalance (to check a desired usernames balance of specified currency type)
  * receives: {userID: [string, required], currency: [string, required, options: [BTC, LTC, ETH]]}
* updateBalance (to increment or decrement desired usernames balance of specified currency type)
  * receives: {userID: [string, required], update: [integer], currency: [string, required, options: [BTC, LTC, ETH]] }
* returnBalance (response event to 'checkBalance' & 'updateBalance')
  * returns: {userID: [string, required], currency: [string, required, options: [BTC, LTC, ETH], balance: [integer]}