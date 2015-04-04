/**
* Created by Reddy on 08-08-2014.
*/
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('Room', function ($q,socketroom,$timeout,$rootScope,socketio) {
    	var servers= {iceServers: [{"url": "stun:stun.l.google.com:19302"}]};
		var constraints = {optional: [{"DtlsSrtpKeyAgreement": true}]};
    	var iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]},
        peerConnections = {},
        currentId, roomId,
        stream;

    function getPeerConnection(id) {
      if (peerConnections[id]) {
        return peerConnections[id];
      }
      var pc = new PeerConnection(servers,constraints);
      peerConnections[id] = pc;
      pc.addStream(stream);
      pc.on('ice',function (candidate) {
      	if(candidate){
        socketroom.emit('msg', { by: currentId, to: id, ice: candidate, type: 'ice' });
       }
       else{
       	console.log("End of candidates.");
       }
      });
      pc.on('addStream',function (evnt) {
        console.log('Received new stream');
        $timeout(function () {
			//Broadcast the received message to chat window(chatController).
			$rootScope.$broadcast("STREAM_RECEIVED",[{
          id: id,
          stream: evnt.stream
        }]);
		}, 0);
        
        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }
      });
      return pc;
    }

    function makeOffer(id) {
    	console.log('making offer'+id);
      var pc = getPeerConnection(id);
      pc.offer({ mandatory: { OfferToReceiveAudio:true, OfferToReceiveVideo: true} },
      function( err, offer){
        if(!err){
          console.log("Creating an offer...");
          console.log(offer);
          
          socketroom.emit('msg', { by: currentId, to: id, sdp: offer, type: 'sdp-offer' });
        }
      }
      );
      
    }

    function handleMessage(data) {
      var pc = getPeerConnection(data.by);
      switch (data.type) {
        case 'sdp-offer':
	        pc.handleOffer(data.sdp, function (err) {
		        if (err) {
		            // handle error
		            console.log(err);
		            return;
		        }
		        // you can call answer with contstraints
		        pc.answer(function (err, answer) {
		            if(!err){
				      console.log("Creating the answer...");console.log(answer);
				      socketroom.emit('msg', { by: currentId, to: data.by, sdp: answer, type: 'sdp-answer' });
				    }
				    else{
				    	console.log('error');
				    	console.log(err);
				    }
		        });
	    	}); 
          break;
        case 'sdp-answer':
          pc.handleAnswer(data.sdp);
          break;
        case 'ice':
          if (data.ice) {
            console.log('Adding ice candidates');
            pc.processIce(data.ice);
          }
          break;
      }
    }

   

    
      socketroom.on('peer.connected', function (params) {
      	console.log('peer.connected');
        makeOffer(params.id);
      });
      socketroom.on('peer.disconnected', function (data) {
        
        $timeout(function () {
			//Broadcast the received message to chat window(chatController).
			$rootScope.$broadcast("STREAM_ENDED",[data]);
		}, 0);
        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }
      });
      socketroom.on('msg', function (data) {
        handleMessage(data);
      });
  
var connected;
    var api = {
    	
      joinRoom: function (r,userId) {
      	var d = $q.defer();
        if (!connected) {
        	
          socketroom.emit('init', { room: r,joiner:true,userId:userId }, function (roomid, id) {
            currentId = id;
            roomId = roomid;
          });
          connected = true;
        }
        d.resolve(r);
        return d.promise;
      },
      createRoom: function (r,userId) {
        var d = $q.defer();
        socketroom.emit('init', {room:r,joiner:false,userId:userId}, function (roomid, id) {
          d.resolve(roomid);
          roomId = roomid;
          currentId = id;
          connected = true;
        });
        return d.promise;
      },
      leaveRoom:function(){
      	 var d = $q.defer();
      	 peerConnections = {};
        socketroom.emit('disconnectRoom', function (roomid, id) {
          d.resolve(roomid);
          roomId = roomid;
          currentId = id;
          connected = false;
        });
        return d.promise;
      },
      muteAudioToggle: function(data){
      	if(data.audioMuted){
      		socketio.emit('muteCall', {communicationId:data.communicationId,from:data.userNumber,to:data.contactNumber,type:'audio-muted'});
      	}
      	else{
      		socketio.emit('muteCall', {communicationId:data.communicationId,from:data.userNumber,to:data.contactNumber,type:'audio-unmuted'});
      	}
      },
      muteVideoToggle:function(data){
      	if(data.videoMuted){
      		socketio.emit('muteCall', {communicationId:data.communicationId,from:data.userNumber,to:data.contactNumber,type:'video-muted'});
      	}
      	else{
      		socketio.emit('muteCall', {communicationId:data.communicationId,from:data.userNumber,to:data.contactNumber,type:'video-unmuted'});
      	}
      },
      speakingToggle:function(data){
      	if(data.speaking){
      		socketio.emit('speakingToggle', {communicationId:data.communicationId,from:data.userNumber,to:data.contactNumber,type:'speaking'});
      	}
      	else{
      		socketio.emit('speakingToggle', {communicationId:data.communicationId,from:data.userNumber,to:data.contactNumber,type:'not-speaking'});
      	}
      },
      disconnect:function(){
      	var d = $q.defer();
        connected = false;
        peerConnections = {};
        d.resolve(connected);
        return d.promise;
      },
      init: function (s) {
        stream = s;
      },
      
    };
    return api;
    });
});