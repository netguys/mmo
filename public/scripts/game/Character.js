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
        this.hits = params.hits;

    }

    Character.prototype.serverUpdate = function(params) {
        var positionUpdate = params.position;

        if(positionUpdate){
            this.x = positionUpdate.x;
            this.y = positionUpdate.y;
        }
        if(params.hits){
            this.hits = params.hits;
        }
    };

    Character.prototype.draw = function(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = "rgba(130, 0, 200, 0.5)";
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.beginPath()

        ctx.fillStyle = "rgba(130, 0, 0, 1)";
        ctx.font = "10pt Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.x, this.y - 20);
        ctx.fillText(this.hits, this.x + 30, this.y)
        ctx.restore();
    };

    Character.prototype.destroy = function () {}

    return Character;
});


