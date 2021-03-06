var socket = io.connect('http://skywrite.website');

const gameStates = {
    NOT_CONNECTED: 0,
    LOBBY: 1,
    GUESSING: 2,
    FINISHED: 3,
};

angular.module('skywrite', [])
    .controller('GameController', function ($scope) {
        prepareCanvas();
        let game = this;
        game.curState = gameStates.NOT_CONNECTED;
        game.players = [];
        game.isPilot = false;
        game.isWrong = false;
        game.timerID = '';
        game.word = '';
        game.winner = '';
        game.nickname = 'Guest' + (Math.floor(Math.random() * 1000));
		game.timeLeft = '';
        game.leaderboard = {};
        game.hasJoined = false;

        game.start = function () {
            socket.emit("start");
        };

        game.join = function () {
            game.hasJoined = true;
            socket.emit('join', game.nickname);
        };

        game.reset = function () {
            socket.emit('reset');
        };

        game.sendGuess = function () {
            socket.emit('guess', game.guess);
            clearTimeout(game.timerID);
            game.isWrong = true;
            game.timerID = setTimeout(function () {
                $scope.$apply(function () {
                    game.isWrong = false;
                });

            }, 3000)
            game.guess = '';
        };

        game.keyPress = function (keyCode) {
            if (keyCode == 13) {
                game.sendGuess();
            }
        }

        socket.on("gameState", function (value) {
            if (!game.hasJoined) {
                return;
            }
            $scope.$apply(function () {
                game.curState = value;
            });

            if (value == gameStates.GUESSING) {
                game.isPilot = false;
                game.isWrong = false;
                game.word = '';
                game.winner = '';
                game.guess = '';
				game.timeLeft = '';
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
            $scope.$apply(function () {
                game.winner = data;
            });
        });

        socket.on("isPilot", function (value) {
            $scope.$apply(function () {
                game.isPilot = value;
                window.isPilot = value;
            });
        });

        socket.on("word", function (value) {
            $scope.$apply(function () {
                game.word = value;
            });
        });

        socket.on("players", function (players) {
            $scope.$apply(function () {
                game.players = JSON.parse(players);
            });
        });

        socket.on("leaderboard", function (leaderboard) {
            $scope.$apply(function() {
                game.leaderboard = JSON.parse(leaderboard);
            });
        });

		socket.on("timeLeft", function (timeLeft) {
            $scope.$apply(function() {
                game.timeLeft = timeLeft;
            });
            console.log('got time left: ' + timeLeft);
        });
		
        socket.on('disconnect', function () {
            game.curState = gameStates.NOT_CONNECTED;
        });
    });