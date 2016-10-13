const cron = require('node-cron')
const envobj = require('envobj')
// const dat = require('dat-js')

const createEmailProvider = require('./lib/send-email.js')
const createEmailReceiver = require('./lib/receive-email')

// setup
const env = envobj({
  SENDGRID_KEY: String
})

// start
main(env)

// main loop
// obj -> null
function main (opts) {
  // send email every weekday at midnight
  const sendEmail = createEmailProvider(opts.SENDGRID_KEY)
  cron.schedule('0 0 * * 0-5', () => sendEmail(createEmail()))

  const receiveEmail = createEmailReceiver(opts.SENDGRID_KEY)
  receiveEmail()
}

// create a new email to be sent through sendgrid
// null -> obj
function createEmail () {
  const pad = (num) => (String(num.length) === 2) ? String(num) : ('0' + num)
  const month = pad((new Date()).getMonth())
  const day = pad((new Date()).getDate())

  const body = `
    Hi human of Dat,

    This is your daily standup reminder. fill in your standup data beneath,
    and we'll update the Dat accordingly. Have a lovely day. -Dat bot

    ============================="The break"=================================

  `

  return {
    from: 'yoshuawuyts+sendgrid_test@gmail.com',
    to: 'yoshuawuyts@gmail.com',
    subject: `[Dat] standup for ${day}/${month}`,
    body: body
  }
}