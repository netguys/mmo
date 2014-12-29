/**
 * Created by alexey.moroz on 18.12.2014.
 */

var utils = {};



utils.measureTime = function(msg, fn){
    var t = 0;

    t = Date.now();
    fn();
    console.log(msg, (  Date.now() - t ) );
};


utils.calcDistance = function (p1, p2) {
    return Math.sqrt( (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y) );
};


utils.vecLength = function (){
    var x, y;
    if( (x = arguments[0]) instanceof Object){// x - vector object.
        return Math.sqrt(x.x * x.x + x.y * x.y);
    }

    y = arguments[1];
    return Math.sqrt(x * x + y * y);
};

/**
 * @description Returns changed vector object. !!!!!!!! CHANGES VECTOR ITSELF IF VECTOR BEING PASSED !!!!!!!
 *
 * @param vec = {x : number, y : number} || Num x, Num y.
 * @returns {Object} normalized.
 */
utils.normalize = function () {
    var vec = arguments[0] instanceof Object ? arguments[0] : { x : arguments[0], y : arguments[1]},
        vecLength = utils.vecLength(vec);

    vec.x /= vecLength;
    vec.y /= vecLength;
    return vec;
};


/**
 * @description Makes a projection of a Point on a given Axis, represented as a vector.
 *
 * @param p - Point to project.
 * @param vec - Vector to project onto.
 *
 * @returns {Object} rp Resulting point where projection lies.
 */

utils.projectPointOnVec = function (p, v) {
    var rp = {
        x : 0,
        y : 0
    };

    rp.x = ( p.y + p.x * v.x / v.y) / ( v.y / v.x + v.x / v.y );
    rp.y = rp.x * v.y / v.x;

    return rp;
};


utils.projectLineOnVec = function (line, v) {
    line.p1 = utils.projectPointOnVec(line.p1, v);
    line.p2 = utils.projectPointOnVec(line.p2, v);
};


utils.lineLength = function (line) {
    return utils.vecLength(line.p1.x - line.p2.x, line.p1.y - line.p2.y);
};

/**
 * @description multiply vector on scalar.
 *
 * @param vec
 * @param value
 * @returns {*}
 */
utils.mulVecScalar = function (vec, value) {
    if(typeof(value) === 'number'){
        vec.x *= value;
        vec.y *= value;

        return vec;
    }
};

utils.getId = (function () {
    if(global.__getSomeId){
        return global.__getSomeId;
    }
    global.__getSomeId = (function () {
        var id = 0;
        return function(){
            return id++;
        }
    })();

    return global.__getSomeId;
})();



module.exports = utils;