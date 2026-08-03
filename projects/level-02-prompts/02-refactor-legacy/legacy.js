// legacy.js — Código intencionalmente mal escrito para refactorizar
// NO usar como referencia de nada. Anti-patrones a propósito.

var fs = require('fs')

function processData(d) {
  var r = []
  for (var i = 0; i < d.length; i++) {
    if (d[i].type == 'user') {
      if (d[i].age >= 18) {
        if (d[i].email != null && d[i].email != '') {
          var x = {}
          x.id = d[i].id
          x.name = d[i].name
          x.email = d[i].email
          x.status = 'active'
          // hardcoded validation
          if (d[i].name.length > 50) {
            x.status = 'name too long'
          }
          // send email
          var smtp = 'smtp.fake.com'
          var port = 587
          console.log('Sending to ' + smtp + ':' + port + ' for ' + x.email)
          // save to file
          fs.writeFileSync('./users.json', JSON.stringify(x), 'utf8')
          r.push(x)
        } else {
          console.log('no email')
        }
      } else {
        console.log('minor')
      }
    } else if (d[i].type == 'order') {
      var total = 0
      for (var j = 0; j < d[i].items.length; j++) {
        total = total + d[i].items[j].price * d[i].items[j].qty
      }
      // apply discount
      if (total > 100) {
        total = total * 0.9
      }
      if (total > 500) {
        total = total * 0.85
      }
      var o = {}
      o.id = d[i].id
      o.total = total
      o.date = new Date().toString()
      // tax
      var tax = total * 0.21
      o.tax = tax
      o.grandTotal = total + tax
      // save order
      fs.appendFileSync('./orders.log', o.id + ',' + o.total + ',' + o.grandTotal + '\n')
      r.push(o)
    } else if (d[i].type == 'notification') {
      // notify
      var msg = d[i].message
      if (msg == null || msg == '') {
        msg = 'default message'
      }
      // hardcoded channels
      var channels = ['email', 'sms', 'push']
      for (var k = 0; k < channels.length; k++) {
        if (channels[k] == 'email') {
          console.log('EMAIL: ' + msg)
        } else if (channels[k] == 'sms') {
          console.log('SMS: ' + msg)
        } else if (channels[k] == 'push') {
          console.log('PUSH: ' + msg)
        }
      }
      r.push({ sent: true, msg: msg })
    }
  }
  return r
}

function getUser(id) {
  var data = fs.readFileSync('./users.json', 'utf8')
  var u = JSON.parse(data)
  if (u.id == id) {
    return u
  } else {
    return null
  }
}

function calc(a, b, c) {
  // god knows what this does
  var x = a * 2
  var y = b + 5
  var z = c - 1
  var res = x + y + z
  if (res > 100) {
    res = res - 10
  }
  if (res < 0) {
    res = 0
  }
  // magic numbers
  return res * 1.18
}

module.exports = { processData, getUser, calc }