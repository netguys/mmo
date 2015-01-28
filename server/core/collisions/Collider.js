/**
 * Created by alexey.moroz on 19.12.2014.
 *
 * Class for collision handling.
 *
 */

var util = require('util'),

    u = getCustomUtils(),

    path = require('path'),
    Subscriber = absRequire('./server/core/Subscriber'),

    gameFieldConfig = absRequire('./server/configs/game_field.json'),

    SECTION_HEIGHT = 20,
    SECTION_WIDTH = 20;

function Collider(){}
util.inherits(Collider, Subscriber);


Collider.constructor = function () {
    Collider.super_.constructor.apply(this, arguments);
};

Collider.prototype.setupListeners = function () {
    var me = this;

    me.on( 'step:collisionUpdate', me.collisionUpdate.bind(me) );
};

Collider.prototype.init = function () {
    var me = this;
    Collider.super_.prototype.init.apply(me, arguments);

    me.shapesPool = [];
    me.collisionRecords = {};

    me.gameFieldDimentions = {
        width : gameFieldConfig.width,
        height : gameFieldConfig.height
    };



    me.sections = me.createSections();
};

Collider.prototype.createSections = function () {
    var me = this,
        sections = [],

        sectionRows = Math.ceil( me.gameFieldDimentions.width / SECTION_WIDTH),
        sectionCols = Math.ceil( me.gameFieldDimentions.height / SECTION_HEIGHT),
        i,j;


    for( i = 0; i < sectionRows; i++){
        sections.push([]);
        for( j = 0; j < sectionCols; j++){
            sections[i].push({
                x : i * SECTION_WIDTH,
                y : j * SECTION_HEIGHT,
                width : SECTION_WIDTH,
                height : SECTION_HEIGHT,

                // array of BoundingShapes element.
                elements : [],

                // used by a bounding shape 'calcSection'. Needed for shapes
                // to determine if they already took that section.
                flaged : false
            });
        }
    }

    return sections;
};


Collider.prototype.collisionUpdate = function () {
    var me = this;

    //clear collision records.
    me.collisionRecords = {};

    //place all shapes to a "covered" sections.
    me.refillSections();

    Debug.do(function () {
       //should have updated sections here.
        var sections = [],
            i, j;

        for( i = 0; i < me.sections.length; i++){
            sections.push([]);
            for( j = 0; j < me.sections[i].length; j++){
                sections[i].push( me.sections[i][j].elements.length > 0 );
            }
        }
       Debug.writeInfo( "sections", {
           SW : SECTION_WIDTH,
           SH : SECTION_HEIGHT,
           sections : sections
       });
    });
    //actual collision check.
    me.checkForCollision();


    me.notifyRegisteredCollisions();
};


Collider.prototype.refillSections = function () {
    var me = this,
        i, j, shape,
        sectionsTaken;

    //clear sections;
    for( i = 0; i < me.sections.length; i++){
        for( j = 0; j < me.sections[i].length; j++){
            me.sections[i][j].elements = [];
        }
    }

    //add all existing collision shapes to a propriate section
    for( i = 0; i < me.shapesPool.length; i++){
        shape = me.shapesPool[i];
        sectionsTaken = shape.calcSections( SECTION_WIDTH, SECTION_HEIGHT, me.sections );

        for( j = 0; j < sectionsTaken.length; j++ ){
            sectionsTaken[j].elements.push( shape );
        }
    }

};

Collider.prototype.checkForCollision = function () {
    var me = this,
        i, j;

    for( i = 0; i < me.sections.length; i++ ){
        for( j = 0; j < me.sections.length; j++ ){
            me.checkSectionForCollision( me.sections[i][j] );
        }
    }
};

Collider.prototype.checkSectionForCollision = function (section) {
    var elements = section.elements,
        i,j;

    if(elements.length <= 1){
        return;
    }
    for( i = 0; i < elements.length; i++){
        for( j = 0; j < elements.length; j++ ){
            if(i != j){
                elements[i].checkCollision( elements[j] );
            }
        }
    }
};

Collider.prototype.notifyRegisteredCollisions = function () {
    var me = this,
        collisionRecords = me.collisionRecords,
        hashKey, record,

        refShape, intShape, cV;

    for( hashKey in collisionRecords){
        record = collisionRecords[hashKey];

        refShape = record.refShape;
        intShape = record.intShape;
        cV = record.cV;

        refShape.master.onCollisionDetected( intShape.master, cV, true );
        intShape.master.onCollisionDetected( refShape.master, u.mulVecScalar( cV, -1), false );
    }
};

/**
 *
 * @param refShape Reference bounding shape.
 * @param intShape interacting bounding shape.
 * @returns {string} Hashed string.
 */

Collider.prototype.hashCollisionRecord = function (refShape, intShape) {
    return refShape.masterId + "/" + intShape.masterId;
};


/**
 *
 * @param refShape Reference shape
 * @param intShape Interacting shape
 * @param cV Correction vector
 */
Collider.prototype.registerCollision = function ( refShape, intShape, cV ) {
    var me = this,
        hash = me.hashCollisionRecord(refShape, intShape),
        record = me.collisionRecords[hash];

    //Shapes collide same every section check, so if there is a record already - skip addition.
    if( record ){
        return;
    }

    //addition of new record about collision.
    me.collisionRecords[hash] = {
        refShape : refShape,
        intShape : intShape,
        cV : cV
    }
};


// being called on a shape Creation.
// TODO: create a shape by means of collider.createShape(shapeName)???
Collider.prototype.addShape = function ( shape ) {
    //console.log("AddShape call. ", shape);
    this.shapesPool.push( shape );
};


// being called on a shape Destruction.
// TODO: handle destrustion in COllider as well???
Collider.prototype.removeShape = function ( shape ) {
    //console.log("removeShape call. ", shape);
    // remove from overall pool
    var index = this.shapesPool.indexOf( shape );
    this.shapesPool.splice( index, 1 );

    // do not delete from containing sections, since they will be
    // cleared with next "collisionUpdate()" iteration.
};

module.exports = createSingletoneExports(Collider);