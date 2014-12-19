var util = require('util'),
    io = require('socket.io'),
    Player = require('./server/Player').Player,
    Step = require('./server/core/Step'),
    Entity = require('./server/gameObjects/Entity');

var socket, players, step;

function init() {update
    players = [];

    socket = io(8090, {
        'transports' : ['websocket']
    });

    setEventHenders();
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
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    }

    players.push(newPlayer)
}

function onMovePlayer(data) {
    var movePlayer = playerById(this.id);

    // Player not found
    if (!movePlayer) {
        util.log('Player not found: '+this.id);
        return;
    };

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Broadcast updated position to connected socket clients
    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
    util.log('X: ' + movePlayer.getX());
}

function onClientDisconnect() {
    util.log('disconnet' + this.id);
    var removePlayer = playerById(this.id);

    // Player not found
    if (!removePlayer) {
        util.log('Player not found: '+this.id);
        return;
    };

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit('remove player', {id: this.id});
}

function setEventHenders() {
    socket.sockets.on('connection', onSocketConnection);
}

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    }

    return false;
};


init();
