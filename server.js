var util = require('util'),
    io = require('socket.io'),
    Player = require('./server/Player').Player;

var socket, players;

function init() {
    players = [];
}

function onSocketConnection( client ) {
    util.log('New player connected' + client.id);
    client.on('disconnect', onClientDisconnect);
    client.on('new player', onNewPlayer);
    client.on('move player', onMovePlayer)
}

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y)

    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    }

    players.push(newPlayer)
}

function onMovePlayer(data) {

}

function onClientDisconnect() {
    util.log('disconnet' + this.id);
}

function setEventHenders() {
    socket.sockets.on('connection', onSocketConnection);
}

socket = io.listen(8090);
socket.configure(function() {
    socket.set('transports', ['websocket']);
    socket.set('log level', 2);
});


init();
