/**
 * Created by Reddy on 05-07-2014.
 */
define(['./app'], function (app) {
	'use strict';
	return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
            .state('home', {
            	url: '/',
            	templateUrl: 'app/views/loading.html',
            	controller: 'LoadingCtrl',
            	module: 'public'
            })
            .state('join', {
            	url: '/join',
            	templateUrl: 'app/views/join.html',
            	controller: 'JoinCtrl',
            	module: 'public'
            })
            .state('authenticate', {
            	url: '/authenticate',
            	templateUrl: 'app/views/otp.html',
            	controller: 'otpCtrl',
            	module: 'public'
            })
            .state('history', {
            	url: '/history',
            	templateUrl: 'app/views/history.html',
            	controller: 'HistoryCtrl',
            	module: 'private'
            })
            .state('contacts', {
            	url: '/contacts',
            	templateUrl: 'app/views/contacts.html',
            	controller: 'ContactsCtrl',
            	module: 'private'
            })
            .state('contactInfo', {
                url: '/contactInfo',
                templateUrl: 'app/views/contactInfo.html',
                controller: 'ContactInfoCtrl',
                module: 'private'
            })
            .state('addContact', {
            	url: '/addContact',
            	templateUrl: 'app/views/addNewContact.html',
            	controller: 'addContactCtrl',
            	module: 'private'
            })
    		.state('chat', {
    			url: '/chat',
    			templateUrl: 'app/views/chat.html',
    			controller: 'chatCtrl',
    			module: 'private'
    		})
            .state('newGroup', {
                url: '/newGroup',
                templateUrl: 'app/views/newGroup.html',
                controller: 'newGroupCtrl',
                module: 'private'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/views/settings.html',
                controller: 'settingsCtrl',
                module: 'private'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'app/views/profile.html',
                controller: 'profileCtrl',
                module: 'private'
            });
		//$locationProvider.html5Mode(true);
	}]);
	

});
