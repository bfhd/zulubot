var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

//don't currently need this bit
//fs.readFile('./raids.json', 'utf8', function(err,data) {
//    if (err) {
//        return console.log(err);
//    }
//   //return console.log(data);
//});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
            case 'rancor': //announce Rancor raid time
                fs.readFile('./raids.json', 'utf8', function(err,data) {
                    if (err) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Couldn\'t get Rancor raid time :('
                        });
                    } else {
                        ranc = JSON.parse(data);
                        bot.sendMessage({
                            to: channelID,
                            message: 'Rancor raid time: ' + ranc.RancorTime
                        });
                    }
                 });
             break;

            case 'haat': //announce Rancor raid time
                fs.readFile('./raids.json', 'utf8', function(err,data) {
                    if (err) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Couldn\'t get HAAT raid time :('
                        });
                    } else {
                        haat = JSON.parse(data);
                        bot.sendMessage({
                            to: channelID,
                            message: 'HAAT raid time: ' + haat.HAATTime
                        });
                    }
                 });
             break;

            case 'jail': // display prisoners (users who have been put in !jail)
                fs.readFile('./jail.json', 'utf8', function(err,data) {
                    if (err) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Couldn\'t find any prisoners :('
                        });
                    } else {
                        jail = JSON.parse(data); 
                        var prisonerslist;
                        for (i = 0; i < jail.Prisoners.length; i++) {
			    prisonerslist += jail.Prisoners[i];
			    prisonerslist += ' ' + '\n';
			}
                        bot.sendMessage({
                            to: channelID,
                            message: 'Current prisoners: \n' + prisonerslist
                        });
                    }
                 });
             break;
         }
     }
});
//todo
// announce raid times
// fix jail
// suggest raid start times

