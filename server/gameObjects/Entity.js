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
    var k = "",
        tmp;
    for(var i=0; i < 100000; i++){
        k = Math.sin(Math.random()*100.3)*Math.cos(Math.random()*100.444)/100.000/Math.log(1232)*Math.acos(Math.cos(Math.random()*dt));
        tmp = new Entity();
    }
    return k;
};

Entity.prototype.onStepPulse = function (globalTime) {
    var me = this,
        dt = globalTime - me.localTime;


    me.update(dt);

    me.localTime = globalTime;
};


module.exports = Entity;