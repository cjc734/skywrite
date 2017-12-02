var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//var funnyWords = require('funnyWords');

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

let pilot = null;

let answer = null;


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
        }
        io.sockets.emit('players', JSON.stringify(Object.keys(players)));
    });

    client.on('guess', function (guess) {
        if (guess == answer) {
            curState = gameStates.FINISHED;
            io.sockets.emit('gameState', curState);
            io.sockets.emit('winner', nickname);
        }
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

        answer = "airplane";

        players[pilot].emit('word', answer);
    });
});

server.listen(3000);  
