/**
 * general file configuration
 */

//start Game
require(['domready', 'init'], function (domReady, init) {
    domReady(function () {
        init.initGame();
    });
});

//config dependencies
require.config({
    baseUrl: 'scripts',
    paths: {
        init : 'init',

        //core
        gameLoop: 'core/gameLoop',

        //game
        Game: 'game/Game',
        Keys: 'game/Keys',
        Player: 'game/Player',

        domready: '../bower_components/requirejs-domready/domReady'
    }
});



