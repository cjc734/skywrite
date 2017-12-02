var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var funnyWords = require('./funnyWords');

app.use('/assets', express.static(__dirname + '/assets'));
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

const gameStates = {
    LOBBY: 1,
    GUESSING: 2,
    FINISHED: 3,
};

let curState = gameStates.LOBBY;

let players = {};

let playerLeaderboard = {};

let pilot = null;

let answer = null;


function reset() {
    let players = {};
    answer = null;
    pilot = null;
    curState = gameStates.LOBBY;
}

io.on('connection', function (client) {
    console.log('Client connected...');

    let nickname = '';

    client.on('join', function (setNickname) {
        nickname = setNickname;
        players[nickname] = client;
        console.log('A new user joined: ' + nickname);

        client.emit('gameState', curState);
        io.sockets.emit('players', JSON.stringify(Object.keys(players)));
    });

    client.on('disconnect', function () {
        if(nickname) {
            delete players[nickname];
            if (nickname in playerLeaderboard) {
                delete playerLeaderboard[nickname];
            }
            console.log(nickname + ' disconnected');
        }
        if (Object.keys(players).length > 0) {
            io.sockets.emit('players', JSON.stringify(Object.keys(players)));
        } else {
            console.log('All players disconnected');
            reset();
        }
    });

    client.on('reset', function () {
        reset();
        io.sockets.emit('gameState', curState);
    });

    client.on('guess', function (guess) {
        if (guess.toLowerCase() == answer) {
            curState = gameStates.FINISHED;
            if (nickname in playerLeaderboard) {
                playerLeaderboard[nickname]++;
            } else {
                playerLeaderboard[nickname] = 1;
            }
            io.sockets.emit('gameState', curState);
            io.sockets.emit('winner', nickname);
            io.sockets.emit('word', answer);
            io.sockets.emit('leaderboard', JSON.stringify(playerLeaderboard));
        }
    });

    client.on('pilotDraw', function (data) {
        Object.keys(players).map((player) => {
            if (player != pilot) {
                players[player].emit('pilotDraw', data);
            }
        });
    });

    client.on('start', function () {
        if (Object.keys(players).length < 2) {
            return;
        }
        curState = gameStates.GUESSING;
        io.sockets.emit('gameState', curState);
        let nicknames = Object.keys(players);
        pilot = nicknames[Math.floor(Math.random() * nicknames.length)];
        console.log(pilot + " chosen as the pilot");

        nicknames.map((player) => {
            players[player].emit('isPilot', player == pilot);
        });

        answer = funnyWords().toLowerCase();

        players[pilot].emit('word', answer);
    });
});

server.listen(3000);  
