/**
 * Created by alexey.moroz on 18.12.2014.
 */


var util = require("util"),
    io = require("socket.io"),
    Step = require("./server/core/Step"),
    Entity = require("./server/gameObjects/Entity");



var step = new Step(),
    entity = new Entity();

step.init(1000);
entity.init();



step.start();


