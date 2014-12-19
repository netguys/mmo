/**
 * Created by alexey.moroz on 18.12.2014.
 */


var util = require('util'),
    u = require('./server/utils'),
    io = require('socket.io'),
    Step = require('./server/core/Step'),
    Entity = require('./server/gameObjects/Entity');



var step = new Step(),
    entitiesNum = 10,
    entities = [],
    entity,
    i;


for(i = 0; i < entitiesNum; i++ ){
    entity = new Entity();
    entity.init();

    entities.push(entity);
}

var startPing = (function(){
    var counter = 0;
    return function (){
        console.log("PING! ", counter);
        counter++;
        process.nextTick(function(){

        });
    };
})();


step.init(1000);
entity.init();

startPing();

step.start();

//u.measureTime("Time to update all: %s", function () {
//    for(i=0; i < entities.length; i++){
//        entities[i].update(Math.random()*40);
//    }
//});




//serverUtils.measureTime("Time to update 1st: %s", function () {
//   entities[0].update(40);
//});
//
//serverUtils.measureTime("Time to update 2nd: %s", function () {
//    entities[1].update(40);
//});

//step.start();


