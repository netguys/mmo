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



module.exports = utils;