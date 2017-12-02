var socket = io.connect('http://localhost:3000/');

const gameStates = {
    NOT_CONNECTED: 0,
    LOBBY: 1,
    GUESSING: 2,
    FINISHED: 3,
};

angular.module('skywrite', [])
    .controller('GameController', function($scope) {
        let game = this;
        game.curState = gameStates.NOT_CONNECTED;

        game.players = [];

        game.nickname = 'Guest' + (Math.floor(Math.random() * 1000));

        game.start = function() {
            socket.emit("start");
        };

        game.join = function() {
            socket.emit('join', game.nickname);
        };

        game.isPilot = false;

        game.word = '';

        game.sendGuess = function() {
            socket.emit('guess', game.guess);
            game.guess = '';
        };
        
        socket.on("gameState", function (value) {
            $scope.$apply(function() {
                game.curState = value;
            });
            console.log('got cur state of ' + value);

            if (value == gameStates.GUESSING) {
                setTimeout(function() {
                    prepareCanvas();
                }, 100);
            }
        });

        socket.on("isPilot", function (value) {
            $scope.$apply(function() {
                game.isPilot = value;
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