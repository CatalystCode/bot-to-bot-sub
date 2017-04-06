var path = require('path');
var express = require('express');
var builder = require('botbuilder');
var request = require('request');
var fs = require('fs');
var port = process.env.PORT || 3978;
var app = express();

console.log('starting sub bot 1');

var config = require('./config');

var masterBotEndpoint = config.get('MASTER_BOT_ENDPOINT');

app.use((req, res, next) => {
  console.log(`service request for url: '${req.url}'`);
  return next();
});

app.get('/', (req, res) => {
  return res.end('Slave Bot is on');
});

var connector = new builder.ChatConnector({ 
  appId: config.get('BOT_APP_ID'), 
  appPassword: config.get('BOT_APP_PASSWORD') 
});

var bot = new builder.UniversalBot(connector, {
  storage: new builder.MemoryBotStorage()
});

bot.dialog('/', [
  (session, args, next) => {

    // keep track of the user's steps in the dialog
    if (!session.privateConversationData.step) {
      session.privateConversationData.step = 1;
    }

    builder.Prompts.text(session, `** -SlaveBot- **: step ${session.privateConversationData.step++}, enter something....`);
  },
  (session, args, next) => {
    
    // actively leave the sub bot and resume control for the master bot if user asks to leave
    if (args.response && args.response.startsWith('leave')) {
      session.endDialog('** -SlaveBot- **: returning control to master');
      var url = masterBotEndpoint + '/api/leave/' + session.message.address.conversation.id;
      return request.post(url, err => {
        if (err) console.error(`error in http request: ${url}: ${err}`)
      });
    }

    // restart dialog loop
    session.replaceDialog('/', 0);
  }
]);

app.post('/api/messages', connector.listen());

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});


module.exports = app;