'use strict'

const builder = require('botbuilder');
const bot = new builder.TextBot();

bot.use((session, next) => {
  // middleware1
  next();
})
bot.use((session, next) => {
  // middleware2
  next();
})

const dialog = new builder.CommandDialog();

dialog.onDefault(() => {
  // dafault
})

dialog.matches('register profile', [
  (session) => {
    session.beginDialog('/profile/name');
  },
  (session) => {
    session.beginDialog('/profile/age');
  },
  (session) => {
    session.beginDialog('/profile/confirm');
  },
  (session) => {
    session.reset('/')
  }
])

bot.add('/profile/name', [
  (session) => {
    builder.Prompts.text(session, 'What\'s your name ?');
  },
  (session, results) => {
    session.userData.name = results.response;
    session.endDialog();
  }
]);

bot.add('/profile/age', [
  (session) => {
    builder.Prompts.number(session, 'How old are you ?');
  },
  (session, results) => {
    session.userData.age = results.response;
    session.endDialog();
  }
])

bot.add('/profile/confirm', [
  (session) => {
    const message = `
      Your name: ${session.userData.name}
      Your age: ${session.userData.age}
      Are you sure ?
    `;
    builder.Prompts.confirm(session, message);
  },
  (session, results) => {
    if (results.response) {
      session.send('Completed the profile registration.');
    } else {
      session.send('Canceled profile registration.');
    }
    session.endDialog();
  }
])

bot.add('/', dialog);
bot.listenStdin();
