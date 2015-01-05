/**
 * Created by alexey.moroz on 18.12.2014.
 */
var util = require('util'),
    path = require('path'),
    u = require( path.resolve( __dirname, '../utils') ),
    Subscriber = require( path.resolve( __dirname, '../core/Subscriber' ) );


function Entity(){};
util.inherits(Entity, Subscriber);


Entity.prototype.init = function(params){
    var me = this;
    Entity.super_.prototype.init.apply(me, arguments);

    me.id = u.getId();
    me.localTime = Date.now();

    me.className = "Entity";

    me.emit("entity:created", me, params);
};

Entity.prototype.setupListeners = function () {
    var me = this;

    //should use "on" only (in current implementation).
    me.on('step:pulse', me.onStepPulse.bind(me));
};


Entity.prototype.update = function(dt){};

Entity.prototype.onStepPulse = function (globalTime) {
    var me = this,
        dt = globalTime - me.localTime;

    me.update(dt);

    me.localTime = globalTime;
};


Entity.prototype.destroy = function () {
    var me = this;

    me.removeAllLocalListeners();
    me.emit("entity:destroyed", me);
};

module.exports = Entity;