/**
 * Created by Reddy on 05-07-2014.
 */
/**
 * bootstraps angular onto the window.document node
 * NOTE: the ng-app attribute should not be on the index.html when using ng.bootstrap
 */
define([
    'require',
    'angular',
    'app',
    'routes',
	'angular-bootstrap',
    'text-angular-sanitize',
	'text-angular-setup',
    'text-angular',
	'jquery',
	'ng-audio',
	'ng-file-upload'
], function (require, ng) {
    'use strict';

    /*place operations that need to initialize prior to app start here
     * using the `run` function on the top-level module
     */

    require(['domReady!'], function (document) {
        /* everything is loaded...go! */
       var onDeviceReadyRun = false;
       function onDeviceReady() {
            //This varibale is for checking wether this method is calling two times or not
            if (onDeviceReadyRun) {
                return;
            }
            onDeviceReadyRun = true;
            ng.bootstrap(document, ['app']);
        }
        // Wait for Cordova to load
        if (window.cordova) {
            document.addEventListener('deviceready', onDeviceReady, false);
        } else {
            //In a browser, execute deviceready immediately
            onDeviceReady();
        }
    });
});
