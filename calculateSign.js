const crypto = require('crypto')

module.exports = function calculateSign (url, secret) {
  var sign = crypto.createHmac('sha512', secret)

  sign = sign.update(url, 'ascii')
  sign = sign.digest('hex')
  return sign
}
