/**
 * Created by alexey.moroz on 24.12.2014.
 *
 * Describes an abstract Projectile containing a velocity, movement vector, and size (Projectile is treated like a circle).
 */

var util = require('util'),
    u = getCustomUtils(),


    Entity = require( PATH.resolve( __dirname, '../gameObjects/Entity' ) ),
    BoundingBox = require( PATH.resolve( __dirname, '../core/collisions/BoundingShapes' ) ).BoundingBox;



function Projectile(){};
util.inherits(Projectile, Entity);

Projectile.constructor = function () {
    Projectile.super_.constructor.apply(this, arguments);
};

Projectile.prototype.setupListeneners = function () {
    var me = this;
    Projectile.super_.prototype.setupListeneners.apply(me, arguments);

    //TODO: collision detection in somehow more accurate manner.
    //me.on('entity:moveInitiated', me.onEntityMoved);
};


Projectile.prototype.init = function (params) {
    var me = this;
    Projectile.super_.prototype.init.apply(me, arguments);

    me.mv = params.direction; //normalized vector
    me.v = params.velocity; //numerical value

    me.pos = params.pos;

    me.bBox = new BoundingBox();
    me.bBox.init(me, params.hw, params.hh);
};


Projectile.prototype.update = function (dt) {
    var me = this,
        dS = me.v * dt/1000;

    //setup artificial boundaries for Projectile to not be able to move if its not in 0,0 500,500 rectangle.
    if( me.pos.x < 0
        || me.pos.y < 0
        || me.pos.x >= 500
        || me.pos.y >= 500 ){
        return;
    }

    me.pos.x += me.mv.x * dS;
    me.pos.y += me.mv.y * dS;
                                            //new cooridnates
    me.emit("entity:moveInitiated", me, { x : me.pos.x + 0, y : me.pos.y + 0 });
};


Projectile.prototype.onEntityMoved = function (entity, newPosition) {
    var me = this,
        correctionVector;

    //can't collide with itself
    if(me === entity){
        return;
    }

    correctionVector = entity.shape.checkCollision(me.shape);
    if(u.vecLength(correctionVector) <= 0){
        return;
    }

    entity.onCollisionDetected(me, correctionVector, true);
    me.onCollisionDetected(entity, u.mulVecScalar(correctionVector, -1), false); //multiply the correction vector by -1 to reverse direction.

};

Projectile.prototype.onCollisionDetected = function (entity, cv, initiator) {

};

module.exports = Projectile;
