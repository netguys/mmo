/**
 * Created by alexey.moroz on 18.12.2014.
 */
var util = require('util'),
    path = require('path'),
    Subscriber = require( path.resolve( __dirname, '../core/Subscriber' ) );


function Entity(){};
util.inherits(Entity, Subscriber);


Entity.constructor = function () {
    Entity.super_.constructor.apply(this, arguments);
};


Entity.prototype.init = function(){
    var me = this;
    Entity.super_.prototype.init.apply(me, arguments);

    me.localTime = Date.now();
};

Entity.prototype.setupListeneners = function () {
    var me = this;

    me.on('step:pulse', me.onStepPulse.bind(me));
};


Entity.prototype.update = function(dt){
    console.log('update call with dt:', dt);
};

Entity.prototype.onStepPulse = function (globalTime) {
    var me = this,
        dt = globalTime - me.localTime;


    me.update(dt);

    me.localTime = globalTime;
};


module.exports = Entity;