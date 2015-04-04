/**
* Created by Reddy on 08-08-2014.
*/
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('VideoStream', function ($q) {
    	var stream;
	    return {
	      get: function (type) {
	      	var isAudio = false;
	      	var isVideo = false;
	      	var constraints={};
	      	if(type=='audio'){
	      		isAudio = true;
	      		constraints = {
	            audio: {optional: [{googEchoCancellation:true}, {googAutoGainControl:true}, 
	            {googNoiseSuppression:true}, {googHighpassFilter:true}, {googAudioMirroring:false}, 
	            {googNoiseSuppression2:true}, {googEchoCancellation2:true}, {googAutoGainControl2:true}, 
	            {googDucking:false}, {chromeRenderToAssociatedSink:true}]}
	         };
	      	}
	      	if(type=='video'){
	      		isAudio = true;
	      		isVideo = true;
	      		constraints = {
	            video:{mandatory: {
			      minWidth: 1280,
			      minHeight: 720
			    }},
	            audio: {optional: [{googEchoCancellation:true},
	            {googAutoGainControl:true}, 
	            {googNoiseSuppression:true}, 
	            {googHighpassFilter:true}, 
	            {googAudioMirroring:false}, 
	            {googNoiseSuppression2:true}, 
	            {googEchoCancellation2:true}, 
	            {googAutoGainControl2:true}, {googDucking:false}, {chromeRenderToAssociatedSink:true}]}
	         	};
	      	}
	        	navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
               navigator.webkitGetUserMedia || navigator.msGetUserMedia;
	          var d = $q.defer();
	          navigator.getUserMedia(constraints, function (s) {
	            stream = s;
	            d.resolve(stream);
	          }, function (e) {
	          	console.log(e);
	            d.reject(e);
	          });
	          return d.promise;
	        
	      }
	    };
    });
});