var path = require('path');
var express = require('express');
var builder = require('botbuilder');
var fs = require('fs');
var port = process.env.PORT || 3978;
var app = express();

console.log('starting sub bot 1');

var config = require('./config');

app.use((req, res, next) => {
  console.log(`service request for url: '${req.url}'`);
  return next();
});

app.use('/alexa', (req, res, next) => {
  console.log(`service request for alexa: '${req.url}'`);
  return res.end('OK');
});

app.get('/', (req, res) => {
  return res.end('Dating Bot is on');
});


var connector = new builder.ChatConnector({ 
  appId: config.get('BOT_APP_ID'), 
  appPassword: config.get('BOT_APP_PASSWORD') 
});

var bot = new builder.UniversalBot(connector);


var i = 0;
bot.dialog('/', [
  (session, args, next) => {
    builder.Prompts.text(session, `SubBot1: iteration:${i} step 1, enter something....`);
  },
  (session, args, next) => {
    session.send(`you typed ${args.response}`);
    builder.Prompts.text(session, `SubBot1: iteration:${i} step 2, enter something....`);
  },
  (session, args, next) => {
    session.send(`you typed ${args.response}`);
    builder.Prompts.text(session, `SubBot1: iteration:${i} step 3, enter something....`);
  },
  (session, args, next) => {
    session.send(`you typed ${args.response}`);
    builder.Prompts.text(session, `SubBot1: iteration:${i} step 4, enter something....`);
  },
  (session, args, next) => {
    session.send(`you typed ${args.response}`);
    builder.Prompts.text(session, `SubBot1: iteration:${i} step 5, enter something....`);
  },
  session => {
    i++;
    session.replaceDialog('/', 0);
  }
]);

app.post('/api/messages', connector.listen());

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});



module.exports = app;