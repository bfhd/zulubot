
var exports = module.exports = {};
    
// !ping
exports.ping = function() {
    bot.sendMessage({
        to: channelID,
        message: 'Pong!'
    });
};

exports.hstr = function() {//announce Rancor raid time
    fs.readFile('./raids.json', 'utf8', function(err,data) {
        if (err) {
            bot.sendMessage({
                to: channelID,
                message: 'Couldn\'t get HSTR raid time :('
            });
        } else {
            ranc = JSON.parse(data);
            var rtime = moment.utc().hours(ranc.RancorTime.substring(0,2)).minutes(0).seconds(0);
            rtime.add(1,'days');
            bot.sendMessage({
                to: channelID,
                message: 'HSTR raid time: ' + ranc.RancorTime + ", " + rtime.local().fromNow() 
            });
        }
    });
};

exports.rancor = function() {//announce Rancor raid time
    fs.readFile('./raids.json', 'utf8', function(err,data) {
        if (err) {
            bot.sendMessage({
                to: channelID,
                message: 'Couldn\'t get Rancor raid time :('
            });
        } else {
            ranc = JSON.parse(data);
            var rtime = moment.utc().hours(ranc.RancorTime.substring(0,2)).minutes(0).seconds(0);
            rtime.add(1,'days');
            bot.sendMessage({
                to: channelID,
                message: 'Rancor raid time: ' + ranc.RancorTime + ", " + rtime.local().fromNow() 
            });
        }
    });
};

exports.haat = function() { //announce HAAT raid time
    fs.readFile('./raids.json', 'utf8', function(err,data) {
        if (err) {
           bot.sendMessage({
                to: channelID,
                message: 'Couldn\'t get HAAT raid time :('
                });
        } else {
            haat = JSON.parse(data);
            htime = moment.utc().hours(haat.HAATTime.substring(0,2)).minutes(0).seconds(0);
            htime.add(1,'days');
            bot.sendMessage({
                to: channelID,
                message: 'HAAT raid time: ' + haat.HAATTime + ", " + htime.local().fromNow()
            });
        }
    });
};

exports.jail = function() { // display prisoners (users who have been put in !jail)
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
};

exports.what = function() { // for commands not recognised
    var rand = Math.random();
    var msg = 'What?';
    if (rand > 0.5) msg = 'Huh?';
    bot.sendMessage({
        to:channelID,
        message: msg
        });
    return;
};

exports.help = function() {
    bot.sendMessage({
        to:channelID,
        message: "This is the help message."
    });
    return;
}

exports.set = function() {
     bot.sendMessage({
        to:channelID,
        message: "This is the set message."
    });
    return;
}   
}