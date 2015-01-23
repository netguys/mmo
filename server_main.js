/**
 * Created by frostik on 02.01.2015.
 *
 * Server entry point.
 *
 */

var util = require('util');

global.PATH = require('path'); //path module
global.EXE_PATH = PATH.resolve( PATH.dirname( require.main.filename ) ); //folder of an executing script

//function returning ./server/utils class. (Added for code simplicity)
global.getCustomUtils = function() {
    return require( PATH.resolve(EXE_PATH, './server/utils') );
};

global.absRequire = function (pathToFile) {
    return require( PATH.resolve( EXE_PATH, pathToFile ) );
};

global.createSingletoneExports = function (desc) {
    return (function () {
        var name = desc.name;
        if(!global.Singletones){
            global.Singletones = {};
        }

        if(global.Singletones[ name ] ){
            return global.Singletones[ name ];
        }

        global.Singletones[ name ] = new desc();
        global.Singletones[ name ].init();

        return global.Singletones[ name ];
    })();
};

//initialize Global Debugger instance.
global.Debug = ( absRequire( './server/core/Debugger' ) ).init();

//creation of singletones section
var Factory = absRequire( "./server/core/Factory" ),
    Register = absRequire( "./server/core/Register" ),
    Collider = absRequire( "./server/core/collisions/Collider");

//Needed to be called after init of all the Singletones, for ALL the classes to obtain a ref on them.
Factory.createClassesDesc();

var Server = require( PATH.resolve( EXE_PATH, './server/core/Server') ),

    app = require('express')(),
    httpServer = require('http').Server(app),
    io = require('socket.io')( httpServer, {
        'transports' : [ 'websocket' ]
    }),
    server = new Server();

server.init({
    io : io,
    app : app,
    httpServer : httpServer
});

var dummyChar = Register.createEntity( 'Character', {
    charName : "DUMMY",
    position : {
        x : 200,
        y : 300
    }
});


server.start(8124);



