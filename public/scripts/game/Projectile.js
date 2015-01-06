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
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
    };
    
    Projectile.prototype.destroy = function () {};

    return Projectile;
});