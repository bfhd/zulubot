var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs');
var auth = require('./auth.json');
var schedule = require('node-schedule');
var moment = require('moment-timezone');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true,
    timestamp: true
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
//    function kek() { logger.info('kek'); bot.sendMessage({to: '377562096088645636', message: 'kek'}); }
//    setInterval(kek,60000); 
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
//get all channels
   /* for (chans in bot.channels) {
    
}*/
//start timers
    var timerrt = new schedule.RecurrenceRule(); //timer for announcements
    var timerht = new schedule.RecurrenceRule();
    var rancortime = 20; //eventually replace with loading from file
    var haattime = 19;
    var rt = moment.utc().hours(rancortime).minutes(0).seconds(0);
    var ht = moment.utc().hours(haattime).minutes(0).seconds(0);
    rt.add(1,'days');
    ht.add(1,'days');
    var localrt = rt;
    var localht = ht; 
    timerrt.minute = 0;
    timerrt.hour = localrt.local().hours();
    timerht.minute = 0;
    timerht.hour = localht.local().hours(); 
    logger.info("rancor raid starts at " + localrt.hours());
    logger.info("haat raid starts at " + localht.hours());
    fs.readFile('./channels.json', 'utf8', function(err,data) {
        if (err) {
            logger.info('Couldn\'t load channel data.');
        } else {
            chan = JSON.parse(data);
        }
    });
    var rancor = schedule.scheduleJob(timerrt, function() {
        bot.sendMessage({to: chan.test, message: 'Rancor time!'});
    });
    var haat = schedule.scheduleJob(timerht, function() {
        bot.sendMessage({to: chan.test, message: 'HAAT time!'});
    });

});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    logger.info('user: ' + user + 'channelid: ' + channelID); 
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
                        var rtime = moment.utc().hours(ranc.RancorTime.substring(0,2)).minutes(0).seconds(0);
                        rtime.add('days',1);
                        bot.sendMessage({
                            to: channelID,
                            message: 'Rancor raid time: ' + ranc.RancorTime + ", " + rtime.local().fromNow() 
                        });
                    }
                 });
             break;

            case 'haat': //announce HAAT raid time
                fs.readFile('./raids.json', 'utf8', function(err,data) {
                    if (err) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'Couldn\'t get HAAT raid time :('
                        });
                    } else {
                        haat = JSON.parse(data);
                        htime = moment.utc().hours(haat.HAATTime.substring(0,2)).minutes(0).seconds(0);
                        htime.add('days',1);
                        bot.sendMessage({
                            to: channelID,
                            message: 'HAAT raid time: ' + haat.HAATTime + ", " + htime.local().fromNow()
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
                        var prisonerslist = "";
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
//TODO:
// announce raid times
// fix jail
// suggest raid start times
// schedule start times with node-schedule, announce raid start or gogogo 
// load all channels at start and get their IDs so it's easier to send messages later
// 
