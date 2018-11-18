const request = require('superagent')
const crypto = require('crypto')

const binanceData = {
  name: 'binance',
  timeOffset: 0,
  recvWindow: 5000,
  baseUrl: 'https://api.binance.com/',
  getAccountData: 'api/v3/account',
  getTrades: 'api/v3/myTrades',
  getAllOrders: '/api/v3/allOrders'
}

let selectedFunc = process.argv[2]
let apiKey = process.argv[3]
let apiSecret = process.argv[4]
let coin = process.argv[5]

// balances
function getAccount (apiKey, apiSecret, data = {}) {
  if (!apiKey || !apiSecret) {
    throw new Error('You need to pass an API key and secret to make authenticated calls.')
  }
  data.timestamp = new Date().getTime() + binanceData.timeOffset
  if (typeof data.recvWindow === 'undefined') data.recvWindow = binanceData.recvWindow
  let query = Object.keys(data).reduce(function (a, k) {
    a.push(k + '=' + encodeURIComponent(data[k]))
    return a
  }, []).join('&')
  let signature = crypto.createHmac('sha256', apiSecret).update(query).digest('hex')
  let url = binanceData.baseUrl + binanceData.getAccountData + '?' + query + '&signature=' + signature
  request
    .get(url)
    .set('X-MBX-APIKEY', apiKey)
    .then(resp => {
      // eslint-disable-next-line no-console
      console.log('Account data: ', resp.body)
    })
    .catch(err =>
      // eslint-disable-next-line no-console
      console.log('error:', err)
    )
}

// All Orders
function getAllOrders (apiKey, apiSecret, coin, data = {}) {
  if (!apiKey || !apiSecret) {
    throw new Error('You need to pass an API key and secret to make authenticated calls.')
  }
  data.timestamp = new Date().getTime() + binanceData.timeOffset
  data.symbol = coin
  if (typeof data.recvWindow === 'undefined') data.recvWindow = binanceData.recvWindow
  let query = Object.keys(data).reduce(function (a, k) {
    a.push(k + '=' + encodeURIComponent(data[k]))
    return a
  }, []).join('&')
  let signature = crypto.createHmac('sha256', apiSecret).update(query).digest('hex')
  let url = binanceData.baseUrl + binanceData.getAllOrders + '?' + query + '&signature=' + signature
  request
    .get(url)
    .set('X-MBX-APIKEY', apiKey)
    .then(resp => {
      // eslint-disable-next-line no-console
      console.log('Orders: ', resp.body)
    })
    .catch(err =>
      // eslint-disable-next-line no-console
      console.log('error:', err)
    )
}

// Trades By Coin
function getTrades (apiKey, apiSecret, coin, data = {}) {
  if (!apiKey || !apiSecret) {
    throw new Error('You need to pass an API key and secret to make authenticated calls.')
  }
  data.timestamp = new Date().getTime() + binanceData.timeOffset
  data.symbol = coin
  if (typeof data.recvWindow === 'undefined') data.recvWindow = binanceData.recvWindow
  let query = Object.keys(data).reduce(function (a, k) {
    a.push(k + '=' + encodeURIComponent(data[k]))
    return a
  }, []).join('&')
  let signature = crypto.createHmac('sha256', apiSecret).update(query).digest('hex')
  let url = binanceData.baseUrl + binanceData.getTrades + '?' + query + '&signature=' + signature
  request
    .get(url)
    .set('X-MBX-APIKEY', apiKey)
    .then(resp => {
      // eslint-disable-next-line no-console
      console.log('Trades: ', resp.body)
    })
    .catch(err =>
      // eslint-disable-next-line no-console
      console.log('error:', err)
    )
}

// runner

function runner (func, key, secret, coin) {
  if (func === 'account') {
    getAccount(key, secret)
  } else if (func === 'orders') {
    if (coin !== undefined) {
      getAllOrders(key, secret, coin)
    } else {
      // eslint-disable-next-line no-console
      console.log('Error: ', 'coin not specified (ETHBTC or otherwise)')
    }
  } else if (func === 'trades') {
    if (coin !== undefined) {
      getTrades(key, secret, coin)
    } else {
      // eslint-disable-next-line no-console
      console.log('Error: ', 'coin not specified (ETHBTC or otherwise)')
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('command not recognised')
  }
}

runner(selectedFunc, apiKey, apiSecret, coin)
