const Big = require('big.js');
const DeepstreamClient = require('deepstream.io-client-js');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const Provider = function (config) {
  this.isReady = false;
  this._config = config;
  this._logLevel = config.logLevel !== undefined ? config.logLevel : 1;
  this._deepstreamClient = null;
};

util.inherits(Provider, EventEmitter);

Provider.prototype.start = function () {
  this._initialiseDeepstreamClient();
};

Provider.prototype.stop = function () {
  this._deepstreamClient.close();
};

Provider.prototype.log = function (message, level) {
  if (this._logLevel < level) {
    return;
  }

  const date = new Date();
  const time = `${date.toLocaleTimeString()}:${date.getMilliseconds()}`;

  console.log(`${time}::Balances::${message}`);
};

Provider.prototype._initialiseDeepstreamClient = function () {
  this.log('Initialising Deepstream connection', 1);

  if (this._config.deepstreamClient) {
    this._deepstreamClient = this._config.deepstreamClient;
    this.log('Deepstream connection established', 1);
    this._ready();
  } else {
    if (!this._config.deepstreamUrl) {
      throw new Error('Can\'t connect to deepstream, neither deepstreamClient nor deepstreamUrl were provided', 1);
    }

    if (!this._config.deepstreamCredentials) {
      throw new Error('Missing configuration parameter deepstreamCredentials', 1);
    }

    this._deepstreamClient = new DeepstreamClient(this._config.deepstreamUrl);
    this._deepstreamClient.on('error', (error) => {
      console.log(error);
    });
    this._deepstreamClient.login(
      this._config.deepstreamCredentials,
      this._onDeepstreamLogin.bind(this)
      );
  }
};

Provider.prototype._onDeepstreamLogin = function (success, error, message) {
  if (success) {
    this.log('Connection to deepstream established', 1);
    this._ready();
  } else {
    this.log(`Can't connect to deepstream: ${message}`, 1);
  }
};

Provider.prototype._ready = function () {
  this._initBalance();
  this._checkBalance();
  this._updateBalance();
  this.log('Provider ready', 1);
  this.isReady = true;
  this.emit('ready');
};


/* initBalance()
 * Takes an object containing the desired unique userID ('userID') 
 * creates record for each currency type and sets their available and actual balances to 0.
 */
Provider.prototype._initBalance = function () {
  this._deepstreamClient.event.subscribe('initBalance', (data) => {
  const balanceRecord = this._deepstreamClient.record.getRecord(`balances/${data.userID}`);
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
Provider.prototype._checkBalance = function () {
  this._deepstreamClient.event.subscribe('checkBalance', (data) => {
    const balanceRecord = this._deepstreamClient.record.getRecord(`balances/${data.userID}`);
    balanceRecord.whenReady(balance => {
      data.balance = +balance.get(`${data.currency}.${data.balanceType}`);
      if (!data.balance) {
        data.balance = 0;
        balance.set(`${data.currency}.${data.balanceType}`, +data.balance);
        // balance.set(`${data.currency}.actual`, +data.balance);
      }
      this._deepstreamClient.event.emit('returnBalance', data);
    });
    balanceRecord.discard();
  });
};

/* updateBalance()
 * Takes an object containing the desired unique userID ('userID'), the increment of change ('update')
 * and the currency type ('currency'). It then emits an event containing the same userID, currency type and the
 * updated balance amount ('balance'). If no 'update' is passed, defaults to 0.
 */
Provider.prototype._updateBalance = function () {
  this._deepstreamClient.event.subscribe('updateBalance', (data) => {
    if (!data.currency || !data.balanceType && data.isExternal === false || !data.userID) {
      console.log('update failed');
      data.success = false;
      this._deepstreamClient.event.emit('returnBalance', data);
    } else  {
      console.log('update success');
      data.success = true;
      if (!data.update) {
        data.update = 0;
      }
      const balanceRecord = this._deepstreamClient.record.getRecord(`balances/${data.userID}`);
      balanceRecord.whenReady((record) => {
        const change = Big(+data.update);
        let balance = 0;
        if (data.isExternal === true) {
          
          let currBalance = record.get(`${data.currency}.actual`) || 0;
          console.log('data', data.currency, currBalance);
          balance = Big(currBalance).plus(change);
          record.set(`${data.currency}.actual`, +balance);
          record.set(`${data.currency}.available`, +balance);
        } else {
          balance = Big(record.get(`${data.currency}.${data.balanceType}`)).plus(change);
          record.set(`${data.currency}.${data.balanceType}`, +balance);
        }
        data.balance = +balance;
        this._deepstreamClient.event.emit('returnBalance', data);
        data.update = 0;
      });
      balanceRecord.discard();
    }
  });
};

module.exports = Provider;
