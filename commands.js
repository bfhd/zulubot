
var exports = module.exports = {};
const logger = require ('winston');   
const fs = require('fs');
const moment = require('moment-timezone'); 
// !ping
exports.ping = async function(bot,msg) {
    const m = await msg.channel.send("Ping?");
    m.edit(`Pong! Latency is approximately ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
};

exports.rancor = function(bot,msg) {//announce Rancor raid time
    fs.readFile('./raids.json', 'utf8', function(err,data) {
        if (err) {
            msg.channel.send('Couldn\'t get Rancor raid time :(')
        } else {
            ranc = JSON.parse(data);
            var rtime = moment.utc().hours(ranc.RancorTime.substring(0,2)).minutes(0).seconds(0);
            rtime.add(1,'days');
            msg.channel.send('Rancor raid time: ' + ranc.RancorTime + ", " + rtime.local().fromNow());
        }
    });
};

exports.haat = function(bot,msg) { //announce HAAT raid time
    fs.readFile('./raids.json', 'utf8', function(err,data) {
        if (err) {
           bot.sendMessage({
                to: msg.channel.ID,
                message: 'Couldn\'t get HAAT raid time :('
                });
        } else {
            haat = JSON.parse(data);
            htime = moment.utc().hours(haat.HAATTime.substring(0,2)).minutes(0).seconds(0);
            htime.add(1,'days');
            msg.channel.send('HAAT raid time: ' + haat.HAATTime + ", " + htime.local().fromNow());
        }
    });
};

exports.jail = function(bot,msg) { // display prisoners (users who have been put in !jail)
    fs.readFile('./jail.json', 'utf8', function(err,data) {
        if (err) {
            bot.sendMessage({
                to: msg.channel.ID,
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
                to: msg.channel.ID,
                message: 'Current prisoners: \n' + prisonerslist
            });
        } 
    });
};

exports.what = function(bot,msg) { // for commands not recognised
    var rand = Math.random();
    var txt = 'What?';
    if (rand > 0.5) txt = 'Huh?';
    msg.channel.send(txt); 
    return;
};
