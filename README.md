# balances
[![CircleCI](https://circleci.com/gh/CryptocracyExchange/balances.svg?style=svg)](https://circleci.com/gh/CryptocracyExchange/balances)

## API Contract ##
* initBalance (to set a new user's balance for all currencies, available & actual, to 0)
  * receives: {userID: [string, required]}
* checkBalance (to check a desired usernames balance of specified currency type)
  * receives: {userID: [string, required], currency: [string, required, options: [BTC, LTC, ETH]]}, balanceType: {string, required, options:['available', 'actual']}
* updateBalance (to increment or decrement desired usernames balance of specified currency type)
  * receives: {userID: [string, required], update: [integer], currency: [string, required, options: [BTC, LTC, ETH]], balanceType: [string, required (unless isExternal === false)], isExternal: [boolean] }
* returnBalance (response event to 'checkBalance' & 'updateBalance')
  * returns: {userID: [string, required], currency: [string, required, options: [BTC, LTC, ETH], balance: [integer], balanceType: [string, options:['available', 'actual']]}
