const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const session = require('telegraf/session')
const {TELEGRAM_TOKEN} = require('../config-env');
const { reply } = Telegraf

const bot = new Telegraf(TELEGRAM_TOKEN)

bot.use(session())

// Register logger middleware
bot.use((ctx, next) => {
  const start = new Date()
  return next().then(() => {
    const ms = new Date() - start
    console.log('response time %sms', ms)
  })
});

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  return ctx.reply(`Welcome! To start receiving notifications please type /getUpdates <key>`);
});

const catPhoto = 'http://lorempixel.com/400/200/cats/'
bot.command('cat', ({ replyWithPhoto }) => replyWithPhoto(catPhoto))


// Start polling
bot.startPolling()

module.exports = bot;