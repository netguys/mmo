/**
 * Created by Alexey on 06-Jan-15.
 *
 * Standard projectile class.
 */
define(function() {

    function Projectile (params) {

        this.x = params.x;
        this.y = params.y;
    }

    Projectile.prototype.serverUpdate = function(params) {
        var positionUpdate = params.position;
        if(positionUpdate){
            this.x = positionUpdate.x;
            this.y = positionUpdate.y;
        }
    };


    Projectile.prototype.draw = function(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
        ctx.fill();
    };
    
    Projectile.prototype.destroy = function () {};

    return Projectile;
});