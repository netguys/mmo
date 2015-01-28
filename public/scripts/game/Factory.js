/**
 * Created by Alexey on 06-Jan-15.
 *
 *
 */
var classNames = [ 'Projectile', 'Character'];

define(classNames, function() {

    //create classes descriptions object
    //key - className
    //value - constructor Function.
    var classesDesc = {},
        i;
    for( i=0; i < classNames.length; i++){
        classesDesc[classNames[i]] = arguments[i];
    }



    function Factory () {}

    Factory.prototype.createInstance = function(params) {
        var entityConstructor = classesDesc[params.className];
        return new entityConstructor(params);
    };

    if(!window.singletones){
        window.singletones = {};
    }
    if(!window.singletones.Factory){
        window.singletones.Factory = new Factory();
    }

    return window.singletones.Factory;
});