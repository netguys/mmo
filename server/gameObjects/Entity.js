/**
 * Created by alexey.moroz on 18.12.2014.
 */
var util = require('util'),
    u = getCustomUtils(),

    Subscriber = absRequire('./server/core/Subscriber' );


function Entity(){};
util.inherits(Entity, Subscriber);


Entity.prototype.getClassName = function () {
    return 'Entity';
};

Entity.prototype.init = function(params){
    var me = this;
    Entity.super_.prototype.init.apply(me, arguments);

    me.id = u.getId();
    me.localTime = Date.now();

    me.notifyCreation(params);
    //me.emit("entity:created", me, params);
};

Entity.prototype.notifyCreation = function (params) {
    this.emit("entity:created", this, params);
};

Entity.prototype.setupListeners = function () {
    var me = this;

    //should use "on" only (in current implementation).
    me.on('step:pulse', me.onStepPulse.bind(me));
};

Entity.prototype.getPosition = function () {
    return {
        x : this.pos.x+0,
        y : this.pos.y+0
    }
};

Entity.prototype.update = function(dt){};

Entity.prototype.onStepPulse = function (globalTime) {
    var me = this,
        dt = globalTime - me.localTime;

    me.update(dt);

    me.localTime = globalTime;
};


//TODO: remove after implemented methods at below.
Entity.prototype.createInitUpdateParams = function () {
    return {};
};


//TODO: implement.
Entity.prototype.getCreationUpdate = function () {};
Entity.prototype.getUpdate = function () {};


Entity.prototype.destroy = function () {
    var me = this;

    me.removeAllLocalListeners();
    me.bShape.destroy();
    //delete me.bShape;

    me.emit("entity:destroyed", me);
};


Entity.prototype.createBoundingShape = function (className, params) {
    var me = this;

    if( !params ){
        params = {};
    }
    params.master = me;
    me.bShape = Singletones.Factory.createInstance( className, params );
};

Entity.prototype.getBoundingShape = function () {
    return this.bShape;
};


/**
 * @description Handler for a collision occurence.
 *
 * @param entity Entity collided with.
 * @param cv Vector2d Correction vector to be applied to this Entity to avoid collision.
 * @param initiator Who initiated the collisionCheck. Provides prioritization.
 */
Entity.prototype.onCollisionDetected = function (entity, cv, initiator) {};



module.exports = Entity;