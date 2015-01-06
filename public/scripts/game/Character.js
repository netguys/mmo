/**
 * Created by Alexey on 06-Jan-15.
 *
 *
 * PLAYER class analog. New server updates integrated.
 */
/**************************************************
 ** GAME PLAYER CLASS
 **************************************************/


define(function() {

    function Character (params) {

        this.id = params.id;
        this.x = params.position.x;
        this.y = params.position.y;
        this.name = params.charName;

    }

    Character.prototype.serverUpdate = function(params) {
        var positionUpdate = params.position;
        if(positionUpdate){
            this.x = positionUpdate.x;
            this.y = positionUpdate.y;
        }
    };

    Character.prototype.draw = function(ctx) {
        ctx.save();
        ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
        ctx.fillStyle = "#00F";
        ctx.font = "15pt Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.x, this.y - 25);
        ctx.restore();
    };

    Character.prototype.destroy = function () {}

    return Character;
});


