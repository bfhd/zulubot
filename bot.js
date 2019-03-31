var Discord = require('discord.js');
var logger = require('winston');
var fs = require('fs');
const config = require('./auth.json');
var schedule = require('node-schedule');
var moment = require('moment-timezone');
const commands = require('./commands.js');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true,
    timestamp: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();

// logging in 
bot.login(config.token);

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
//get all channels
   /* for (chans in bot.channels) {
    
}*/
//start timers
    var timerrt = new schedule.RecurrenceRule(); //timer for announcements - rancor
    var timerht = new schedule.RecurrenceRule(); // haat
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
    fs.readFile('./channels.json', 'utf8', function(err,data) {
        if (err) {
            logger.info('Couldn\'t load channel data.');
        } else {
            chan = JSON.parse(data);
        }
    });
    var rancor = schedule.scheduleJob(timerrt, function() {
        bot.channels.get(chan.test).send('Rancor time!');
    });
    var haat = schedule.scheduleJob(timerht, function() {
        bot.channels.get(chan.test).send('HAAT time!');
    });
    var hstr = schedule.scheduleJob(timehstr,function() {
        bot.channels.get(chan.test).send('HSTR time!');
    });

});
bot.on("message", async message => {
    logger.info('user: ' + message.author + 'channelid: ' + message.channel.name + ' message: ' + message.content); 
    if (message.author.bot) return; //ignore other bots
    // commands will start with a !, we will ignore messages that don't
    if (message.content.indexOf(config.prefix) !== 0) return;
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0].toLowerCase();
      
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                commands.ping(bot,message);
                break;
            case 'rancor': //announce Rancor raid time
                commands.rancor(bot,message);
                break;
            case 'haat': //announce HAAT raid time
                commands.haat(bot,message);
                break;
            case 'hstr': //announce HSTR raid time
                commands.hstr(bot,message);
                break;
            case 'jail': // display prisoners (users who have been put in !jail)
                commands.jail(bot,args);
                break;
            case 'set': //change raid times
                commands.set(bot,message);
                break;
            case help: //display help message
                commands.help(bot,message);
                break;
             default:
                commands.what(bot,message);
                break;
        }
     }
});

bot.on('disconnect', function(erMsg, code) {
    logger.info('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
    bot.connect();
});


//TODO:
// fix jail
// suggest raid start times - no longer needed - still do it because it's useful
// schedule start times with node-schedule, announce raid start or gogogo - done    DSX
// load all channels at start and get their IDs so it's easier to send messages later
// 
