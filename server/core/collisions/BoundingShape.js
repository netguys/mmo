/**
 * Created by alexey.moroz on 14.01.2015.
 *
 * Abstract BoundingShape attached to a Entity.
 */
var util = require('util'),

    u = getCustomUtils();

function BoundingShape(){}

BoundingShape.prototype.init = function (params) {
    this.master = params.master;
    this.masterId = this.master.id;
    Singletones.Collider.addShape ( this );
};

BoundingShape.prototype.checkCollision = function (shape) {};

BoundingShape.prototype.destroy = function () {
  Singletones.Collider.removeShape ( this );
};

BoundingShape.prototype.isInSection = function ( section ) {
    return false;
};

BoundingShape.prototype.calcSections = function ( sw, sh, sections ) {
    var me = this,
        taken = [],
        pos = me.master.getPosition();

    //push current position
    taken.push(sections[Math.ceil( pos.x / sw )][Math.ceil( pos.y / sh ) ] );

    return taken;
};

module.exports = BoundingShape;