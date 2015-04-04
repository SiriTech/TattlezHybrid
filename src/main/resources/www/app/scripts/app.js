/**
 * Created by Reddy on 05-07-2014.
 */
define([
    'angular',
    'angular-route',
    'angular-ui-router',
    './controllers/index',
	'./services/index',
	'./directives/index',
	'angular-bootstrap',
    'text-angular-sanitize',
    'text-angular',
    'ng-audio',
    'ng-file-upload',
    'videogular',
    'videogular-controls',
    'videogular-overlay-play',
    'videogular-poster',
    'videogular-buffering'
], function (angular) {
    'use strict';

    return angular.module('app', [
       'tattlez.controllers',
	   'tattlez.services',
	   'tattlez.directives',
        'ui.router',
		'ui.bootstrap',
        'textAngular',
        'ngAudio',
        'angularFileUpload',
        "com.2fdevs.videogular",
		"com.2fdevs.videogular.plugins.controls",
		"com.2fdevs.videogular.plugins.overlayplay",
		"com.2fdevs.videogular.plugins.poster"
    ]);
});
