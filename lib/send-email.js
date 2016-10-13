const sendgrid = require('sendgrid')
const assert = require('assert')

module.exports = createProvider

// send an email
// str -> (obj, obj) -> null
function createProvider (key) {
  assert.equal(typeof key, 'string', 'sendgrid: key should be a string')
  const sg = sendgrid(key)

  return function sendEmail (opts) {
    assert.equal(typeof sg, 'object', 'sendgrid: opts should be an object')

    var helper = require('sendgrid').mail
    var fromEmail = new helper.Email(opts.from)
    var toEmail = new helper.Email(opts.to)
    var subject = opts.subject
    var content = new helper.Content('text/plain', opts.body)
    var mail = new helper.Mail(fromEmail, subject, toEmail, content)

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })

    sg.API(request, function (err, res) {
      if (err) return console.error(err)
      console.log(res.statusCode)
      console.log(res.body)
      console.log(res.headers)
    })
  }
}
