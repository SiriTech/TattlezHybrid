/**
 * Created by Reddy on 05-07-2014.
 */
require.config({

    // alias libraries paths
	paths: {
		'jquery':'../vendor/jquery/dist/jquery.min',
        'angular': '../vendor/angular/angular',
        'angular-route': '../vendor/angular-route/angular-route',
        'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router',
        'domReady': '../vendor/requirejs-domready/domReady',
		'angular-bootstrap':'../vendor/angular-bootstrap/ui-bootstrap-tpls.min',
		'text-angular': './vendorjs/textAngular/textAngular',
		'text-angular-setup': './vendorjs/textAngular/textAngularSetup',
        'text-angular-sanitize':'./vendorjs/textAngular/textAngular-sanitize',
        'ng-audio':'../vendor/angular-audio/app/angular.audio',
        'ng-file-upload':'../vendor/ng-file-upload/angular-file-upload',
        'ng-file-upload-shim':'../vendor/ng-file-upload/angular-file-upload-shim',
        'videogular':'../vendor/videogular/videogular',
        'videogular-controls':'../vendor/videogular-controls/vg-controls',
        'videogular-overlay-play':'../vendor/videogular-overlay-play/vg-overlay-play',
        'videogular-poster':'../vendor/videogular-poster/vg-poster',
        'videogular-buffering':'../vendor/videogular-buffering/vg-buffering'
    },
    // angular does not support AMD out of the box, put it in a shim
	shim: {
		'jquery': {
			exports:'$'
		},
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-ui-router':{
            deps:['angular']
        },
        'angular-bootstrap': {
			deps:['angular']
        },
        'text-angular-sanitize':{
            deps:['angular']
        },
        'text-angular-setup': {
        	deps:['angular']
        },
        'text-angular': {
            deps:['angular']
        },
        'ng-audio':{
        	deps:['angular']
        },
        'ng-file-upload':{
        	deps:['angular']
        },
        'videogular':{
        	deps:['angular']
        },
        'videogular-controls':{
        	deps:['angular']
        },
        'videogular-overlay-play':{
        	deps:['angular']
        },
        'videogular-poster':{
        	deps:['angular']
        },
        'videogular-buffering':{
        	deps:['angular']
        }
        
    },
    // kick start application
    deps: ['./appStart']
});
