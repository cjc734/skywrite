var socket = io.connect('http://ben-surfacebook.wireless.rit.edu:3000/');

const gameStates = {
    NOT_CONNECTED: 0,
    LOBBY: 1,
    GUESSING: 2,
    FINISHED: 3,
};

angular.module('skywrite', [])
    .controller('GameController', function($scope) {
        prepareCanvas();
        let game = this;
        game.curState = gameStates.NOT_CONNECTED;
        game.players = [];
        game.isPilot = false;
        game.word = '';
        game.winner = '';
        game.nickname = 'Guest' + (Math.floor(Math.random() * 1000));

        game.start = function() {
            socket.emit("start");
        };

        game.join = function() {
            socket.emit('join', game.nickname);
        };

        game.reset = function() {
            socket.emit('reset');
        };

        game.sendGuess = function() {
            socket.emit('guess', game.guess);
            game.guess = '';
        };
        socket.on("gameState", function (value) {
            $scope.$apply(function() {
                game.curState = value;
            });

            if (value == gameStates.GUESSING) {
                game.isPilot = false;
                game.word = '';
                game.winner = '';
                game.guess = '';
                window.clickX = [];
                window.clickY = [];
                window.clickDrag = [];
                redraw();
            }
        });

        socket.on('pilotDraw', function (data) {
            let positions = JSON.parse(data);
            addNonPilotClick(positions[0], positions[1], positions[2]);
            redraw();
        });

        socket.on('winner', function (data) {
            $scope.$apply(function() {
                game.winner = data;
            });
        });

        socket.on("isPilot", function (value) {
            $scope.$apply(function() {
                game.isPilot = value;
                window.isPilot = value;
            });
            console.log('isPilot: ' + value);
        });

        socket.on("word", function (value) {
            $scope.$apply(function() {
                game.word = value;
            });
            console.log('word: ' + value);
        });

        socket.on("players", function (players) {
            $scope.$apply(function() {
                game.players = JSON.parse(players);
            });
            console.log('got players: ' + players);
        });

        socket.on('disconnect', function() {
            game.curState = gameStates.NOT_CONNECTED;
        });
    });