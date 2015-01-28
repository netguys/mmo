/**
 * Created by alexey.moroz on 14.01.2015.
 */


var util = require('util'),

    u = getCustomUtils(),

    BoundingShape = absRequire( "./server/core/collisions/BoundingShape");



function BoundingCircle(){}
util.inherits(BoundingCircle, BoundingShape);


BoundingCircle.constructor = function () {
    BoundingCircle.super_.constructor.apply(this, arguments);
};

BoundingCircle.prototype.init = function ( params ) {
    var me = this;
    BoundingCircle.super_.prototype.init.apply(me, arguments);
    me.master = params.master;
    me.radius = params.radius;

};


BoundingCircle.prototype.checkCollision = function ( shape ) {
    var me = this,
        cV;

    if(shape instanceof BoundingCircle){
        cV = me.checkCircleCollision(shape);
        if( !cV ){
            return;
        }

        //
        Singletones.Collider.registerCollision( me, shape, cV );
        //pass correction vector to an object
        //me.master.onCollisionDetected( shape.master, cV, true );
        //shape.master.onCollisionDetected( me.master, u.mulVecScalar( cV, -1), false );
    }

};

BoundingCircle.prototype.checkCircleCollision = function (shape) {
    var me = this,
        selfPosition,
        otherPosition,
        deviation = .0,
        dV;

    deviation = (u.calcDistance( selfPosition = me.master.getPosition(), otherPosition = shape.master.getPosition()) - (me.radius + shape.radius) );

    if( deviation > 0 ){
        return false;
    }

    dV = u.normalize( otherPosition.x - selfPosition.x, otherPosition.y - selfPosition.y );

    dV.x *= deviation;
    dV.y *= deviation;

    return dV;
};


BoundingCircle.prototype.isInSection = function ( section ) {
    var pos = this.master.getPosition();

    return section.elements.indexOf(this) !== -1;
};

BoundingCircle.prototype.calcSections = function (sw, sh, sections) {
    var taken = [],
        pos = this.master.getPosition(),
        circle = {
            x : pos.x,
            y : pos.y,
            r : this.radius
        },
        startSecIndex = Math.floor( (circle.x - circle.r) / sw),
        endSecIndex = Math.floor( (circle.x + circle.r) / sw),
        rootSquared,
        cx = Math.floor( circle.x / sw ), cy = Math.floor( circle.y / sh ),
        i,
        sx1, sy1, sx2, sy2, sxFloor1, syFloor1, sxFloor2, syFloor2,
        x, y;


    function addNeighbour(x, y){
        //if no suchsection return
        if( !sections[x] || !sections[x][y] ){
            return;
        }

        if( sections[x][y].flaged ){
            return;
        }
        addSections(x, y);

        addNeighbour(x+1, y);
        addNeighbour(x-1, y);
        addNeighbour(x, y+1);
        addNeighbour(x, y-1);
    }

    function addSections( x, y ){

        //if no suchsection return
        if( !sections[x] || !sections[x][y] ){
            return;
        }

        if( sections[x][y].flaged ){
            return;
        }

        //mark current section as taken.
        sections[x][y].flaged = true;
        taken.push( sections[x][y] );
    }

    //horizontal
    for( i = startSecIndex; i <= endSecIndex; i++){
        x = i * sw;
        rootSquared = circle.r * circle.r - (x - circle.x) * (x - circle.x);

        if( rootSquared === 0 ){
            sx1 = i;
            sy1 = circle.y / sh;
            syFloor1 = Math.floor( sy1 );

            addSections( i, syFloor1 );
            addSections( i - 1, syFloor1 );

            if(sy1 == syFloor1 ){
                addSections( i, syFloor1 - 1 );
                addSections( i - 1, syFloor1 - 1 );
            }

        }
        if( rootSquared > 0 ){

            //first point
            sx1 = i;
            sy1 = (Math.sqrt( rootSquared ) + circle.y) / sh;
            syFloor1 = Math.floor( sy1 );
            addSections( sx1, syFloor1 );
            addSections( sx1 - 1, syFloor1 );
            if(sy1 == syFloor1 ){
                addSections( sx1, syFloor1 - 1 );
                addSections( sx1 - 1, syFloor1 - 1 );
            }


            sx2 = i;
            //sy2 supposed to be always less
            sy2 = ( -Math.sqrt( rootSquared ) + circle.y ) / sh;
            syFloor2 = Math.floor( sy2 );
            addSections( sx2, syFloor2 );
            addSections( sx2 - 1, syFloor2 );
            if(sy2 == syFloor2 ){
                addSections( sx2, syFloor2 - 1 );
                addSections( sx2- 1, syFloor2 - 1 );
            }

        }
    }


    //vertical
    startSecIndex = Math.floor( (circle.y - circle.r) / sh);
    endSecIndex = Math.floor( (circle.y + circle.r) / sh);
    for( i = startSecIndex; i <= endSecIndex; i++){
        y = i * sh;
        rootSquared = circle.r * circle.r - (y - circle.y) * (y - circle.y);

        if( rootSquared === 0 ){
            sx1 = circle.x / sw;
            sy1 = i;
            sxFloor1 = Math.floor( sx1 );
            addSections( sxFloor1, i );
            addSections(  sxFloor1, i - 1 );
            if(sx1 == sxFloor1 ){
                addSections( sxFloor1 - 1 , i );
                addSections( sxFloor1 - 1, i - 1 );
            }

        }
        if( rootSquared > 0 ){

            //first point
            sx1 = (Math.sqrt( rootSquared ) + circle.x) / sw;
            sy1 = i;
            sxFloor1 = Math.floor( sx1 );
            addSections( sxFloor1, i );
            addSections(  sxFloor1, i - 1 );
            if(sx1 == sxFloor1 ){
                addSections( sxFloor1 - 1 , i );
                addSections( sxFloor1 - 1, i - 1 );
            }

            sx2 = ( - Math.sqrt( rootSquared ) + circle.x)/ sw;
            sy2 = i;
            sxFloor2 = Math.floor( sx2 );
            addSections( sxFloor2, i );
            addSections(  sxFloor2, i - 1 );
            if(sx2 == sxFloor2 ){
                addSections( sxFloor2 - 1 , i );
                addSections( sxFloor2 - 1, i - 1 );
            }

        }
    }

    if(taken.length === 0){
        if( sections[cx] && sections[cx][cy] ){

            taken.push( sections[cx][cy] );
        }
    }else{
        addNeighbour(cx, cy);
    }

    for( i = 0; i < taken.length; i++){
        taken[i].flaged = false;
    }

    return taken;
}


module.exports = BoundingCircle;