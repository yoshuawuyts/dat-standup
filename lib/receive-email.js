const serverRouter = require('server-router')
const assert = require('assert')
const http = require('http')

const parseSendGridHook = require('./parse-sendgrid-hook.js')

// resource:
// https://sendgrid.com/docs/Integrate/Code_Examples/Webhook_Examples/nodejs.html
module.exports = receiveEmail

function receiveEmail (cb) {
  assert.equal(typeof cb, 'function')

  const router = serverRouter([
    ['/parse', {
      post: function (req, res) {
        parseSendGridHook(req, res, (err, email) => {
          if (err) {
            res.statusCode = 500
            console.error(err)
            return res.end()
          }
          cb(email)
        })
      }
    }]
  ])

  const server = http.createServer(router)
  return { listen: listen }

  function listen (port, cb) {
    assert.equal(typeof port, 'number')
    server.listen(port, () => cb(port))
  }
}
