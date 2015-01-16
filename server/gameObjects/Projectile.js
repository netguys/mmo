/**
 * Created by alexey.moroz on 24.12.2014.
 *
 * Describes an abstract Projectile containing a velocity, movement vector, and size (Projectile is treated like a circle).
 */

var util = require('util'),
    u = getCustomUtils(),


    Entity = absRequire( './server/core/gameObjects/Entity' ),
    BoundingBox = absRequire( './server/core/collisions/BoundingCircle' ),
    Character = absRequire( './server/core/gameObjects/Character' );



function Projectile(){};
util.inherits(Projectile, Entity);

Projectile.constructor = function () {
    Projectile.super_.constructor.apply(this, arguments);
};

Projectile.prototype.getClassName = function () {
    return 'Projectile';
};

Projectile.prototype.setupListeners = function () {
    var me = this;
    Projectile.super_.prototype.setupListeners.apply(me, arguments);

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

Projectile.prototype.createInitUpdateParams = function () {
    var me = this;

    return {
        position : me.pos
    };
};



Projectile.prototype.update = function (dt) {
    var me = this,
        dS = me.v * dt/1000;

    //setup artificial boundaries for Projectile to be alive only in [ (0,0) (2000,2000) ] rectangle.
    if( me.pos.x < 0
        || me.pos.y < 0
        || me.pos.x >= 2000
        || me.pos.y >= 2000 ){

        me.destroy();
        return;
    }

    me.pos.x += me.mv.x * dS;
    me.pos.y += me.mv.y * dS;
                                            //new cooridnates
    me.emit( "entity:moveInitiated", me, me.getPosition() );
};

/**
 * @description Handler for a collision occurence.
 *
 * @param entity Entity collided with.
 * @param cv Vector2d Correction vector to be applied to this Entity to avoid collision.
 * @param initiator Who initiated the collisionCheck. Provides prioritization.
 */
Projectile.prototype.onCollisionDetected = function (entity, cv, initiator) {

    if(entity instanceof Character && initiator){
        this.destroy();
    }
};

module.exports = Projectile;
