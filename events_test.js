/**
 * Created by alexey.moroz on 18.12.2014.
 */

/**
 * Global constants and functions declaration.
 */

var u = require( PATH.resolve( EXE_PATH, './server/utils' )),
    io = require('socket.io'),
    Step = require('./server/core/Step'),
    Player = require('./server/core/lobby/Player');



var p1 = new Player();
p1.init({
    userId : u.getId(),
    userName : "ksusha"
});

var char = Register.createEntity( "Character", {
        position : {
            x : 1,
            y : 1
        }
    }),
    proj;

char.moveTo(1, 21);

proj = char.shoot(21, 1)

//console.log("char === ", char, "\n");
//console.log("proj === ", proj, "\n");

var step = new Step();
step.init();


step.start();
setTimeout(function () {
    step.stop();
    console.log('char ===', char);
    console.log('\n\nproj ===', proj);
    console.log("\n\np1.changes", p1.changes.popChanges());
}, 2000);


