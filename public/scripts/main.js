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

        domready:   '../bower_components/requirejs-domready/domReady'
    }
});



