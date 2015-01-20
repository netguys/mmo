/**
 * Created by alexey.moroz on 19.12.2014.
 *
 * Class for collision handling.
 *
 */

var util = require('util'),
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

    console.log("Created Sections: ", sectionRows, sectionCols);

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

    //place all shapes to a "covered" sections.
    me.refillSections();

    Debug.do(function () {
       //should have updated sections here.
       Debug.writeInfo( "sections", me.sections );
    });
    //actual collision check.
    me.checkForCollision();
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

    for( i = 0; i < elements.length; i++){
        for( j = 0; j < elements.length; j++ ){
            if(i != j){
                elements[i].checkCollision( elements[j] );
            }
        }
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

    // do not delete from containing sectors, since they will be
    // cleared with next "collisionUpdate()" iteration.
};

module.exports = createSingletoneExports(Collider);