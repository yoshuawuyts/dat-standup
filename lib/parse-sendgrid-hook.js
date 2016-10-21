const multipart = require('multipart-read-stream')
const concat = require('concat-stream')
const parseJson = require('body/json')
const pump = require('pump')

module.exports = parseSendGridHook

function parseSendGridHook (req, res, cb) {
  var hasErrored = false
  const files = []
  const ws = multipart(req, res, handle, cb)
  pump(req, ws, function (err) {
    if (hasErrored) return
    if (err) {
      hasErrored = true
      return cb(err)
    }

    parseJson(req, res, function (err, body) {
      if (err) return cb(err)
      const ret = {
        from: body.from,
        text: body.text,
        subject: body.subject,
        attachmentCount: body.attachments,
        attachments: files
      }
      return cb(null, ret)
    })
  })

  // handle multipart file
  function handle (fieldname, file, filename) {
    const ws = concat(function (buf) {
      files.push(String(buf))
    })
    pump(file, ws, function (err) {
      if (hasErrored) return
      if (err) {
        hasErrored = true
        return cb(err)
      }
    })
  }
}
