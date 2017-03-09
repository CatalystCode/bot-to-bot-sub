var path = require('path');
var express = require('express');
var builder = require('botbuilder');
var fs = require('fs');
var bodyParser = require('body-parser')
var port = process.env.PORT || 3978;
var app = express();

console.log('starting sub bot 1');

var config = require('./config');

app.use((req, res, next) => {
  console.log(`service request for url: '${req.url}'`);
  console.log(`headers:\n${JSON.stringify(req.headers, true, 2)}\n\n`);
  

  /*
  var data = '';
  req.on('data', chunk => {
    data += chunk.toString(); 
    console.log('data: ', data);
  });
  req.on('end', () => {
    var json = JSON.parse(data);
    console.log(`body: ${JSON.stringify(data, 2, true)}`);
    res.end();
  });
  req.on('error', err => console.error(err))
  */
  return next();
});


app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`body:\n${JSON.stringify(req.body, true, 2)}`);
  return next();
});


app.get('/', (req, res) => {
  return res.end('Dating Bot is on');
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
    //session.send(`you typed ${args.response}`);
    session.replaceDialog('/', 0);
  }
]);

app.post('/api/messages', connector.listen());

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});



module.exports = app;