/**
 * Created by alexey.moroz on 18.12.2014.
 */

var u = getCustomUtils(),
    Factory = require( PATH.resolve( EXE_PATH, "./server/core/Factory" ) ),
    ClientSocket = require( PATH.resolve( EXE_PATH, "./server/core/connection/ClientSocket" ) );

function Connector(){}


Connector.prototype.init = function ( params ) {
    var me = this;

    me.server = params.server;
    me.users = {};

    me.server.on("connection", me.onConnection.bind(me) );
};


Connector.prototype.onConnection = function (socket) {
    var me = this,
        userId = "u" + u.getId(),
        clientSocket = Factory.create("ClientSocket", {
            userId : userId,
            socket : socket
        }),
        newPlayer;

    console.log("Player connected: ", userId);

    newPlayer = Factory.create("Player", {
        userId : userId,
        clientSocket : clientSocket
    });

    me.users[userId] = newPlayer;
};