/**
 * Created by Reddy on 01/8/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('chatCtrl', function ($scope,$rootScope, $state, contactsSrvc, chatSrvc, textAngularManager,$timeout,joinSrvc,$filter,socketio,configSrvc,$upload,socketiostream,guid,$sce,VideoStream,Room) {
		var userNumber;
		var joined = false;
		$scope.isShowSmileys=false;
		$scope.chatFormCls="chat-form";
		$scope.smileySrc="../images/smiley.png";
		
    	$scope.upload = function (files) {
	        if (files && files.length) {
	            for (var i = 0; i < files.length; i++) {
	                var file = files[i];
	                var newGuid = guid.newguid();
	                 var stream = ss.createStream();
	                if(file.type.indexOf('video') > -1){
		                var fileTypeSplit = (file.name).split('.');
		                var fileType = fileTypeSplit[fileTypeSplit.length-1];
		                var fileName = newGuid+"."+fileType;
						// upload a file to the server.
						var data = { name: fileName,communicationId:$scope.communicationId,from:userNumber,mediaType:file.type };
						
							$timeout(function () {
								
								var doc = {};
								doc.guid = newGuid;
								doc.communicationId = $scope.communicationId;
								doc.message = $scope.newMsg;
								doc.from = userNumber;
								doc.to=$scope.contactDetails.contactNumber;
								doc.on = new Date();
								doc.isMedia = true;
								doc.isVideo = true;
								doc.mediaType=file.type;
								doc.fromLabel='me';
								doc.path='../images/video_thumbnail.png';
								doc.uploadWidth="0";
								doc.progress=true;
								$scope.msgs.push(doc);
								console.log(doc);
								$scope.scrollMsgDivUp(0);
								ss(socketiostream).emit('communication-files', stream, data);
								var blobStream = ss.createBlobReadStream(file);
								var size = 0;
								blobStream.on('data', function (chunk) {
									size += chunk.length;
									var percentage = Math.floor(size / file.size * 100);
									if(percentage == "100"){
										//$scope.addMessage(true,true,data);
										$timeout(function(){$scope.msgs[$scope.msgs.length-1].progress=false;},100);	
									}
									$scope.msgs[$scope.msgs.length-1].uploadWidth="width"+percentage;
								});
								blobStream.pipe(stream);
							});
	    				
    				}
	                if(file.type.indexOf('image') > -1){
		                var fileTypeSplit = (file.name).split('.');
		                var fileType = fileTypeSplit[fileTypeSplit.length-1];
		                var fileName = newGuid+"."+fileType;
		               
						// upload a file to the server.
						var data = { name: fileName,communicationId:$scope.communicationId,from:userNumber,mediaType:file.type };
						var fileReader = new FileReader();
	    				fileReader.readAsDataURL(file);
	    				fileReader.onload = function (e) {
							$timeout(function () {
								$scope.dataUrl = e.target.result;
								var doc = {};
								doc.guid = newGuid;
								doc.communicationId = $scope.communicationId;
								doc.message = $scope.newMsg;
								doc.from = userNumber;
								doc.to=$scope.contactDetails.contactNumber;
								doc.on = new Date();
								doc.isMedia = true;
								doc.isVideo=false;
								doc.mediaType=file.type;
								doc.fromLabel='me';
								doc.path=e.target.result;
								doc.uploadWidth="0";
								doc.progress=true;
								$scope.msgs.push(doc);
								$scope.scrollMsgDivUp(0);
								ss(socketiostream).emit('communication-files', stream, data);
								var blobStream = ss.createBlobReadStream(file);
								var size = 0;
								blobStream.on('data', function (chunk) {
									size += chunk.length;
									var percentage = Math.floor(size / file.size * 100);
									if(percentage == "100"){
										$scope.addMessage(true,false,data);
										$timeout(function(){$scope.msgs[$scope.msgs.length-1].progress=false;},100);	
									}
									$scope.msgs[$scope.msgs.length-1].uploadWidth="width"+percentage;
								});
								blobStream.pipe(stream);
							});
	    				};
    				}
					
					
					
	            }
	        }
	    };
	    
		$scope.$on("IMAGE_RECEIVED", function (event,data) {
			$timeout(function () {
				var fileTypeSplit = (data.filename).split('.');
	            var guid = fileTypeSplit[0];
	            var msg = $filter('filter')($scope.msgs,{guid:guid},true);
	            if(msg[0].mediaType.indexOf('video') > -1){
	            	console.log(data);
	            	var path = (data.path).replace('app',configSrvc.serverURL);
	            	msg[0].path=[
									{src: $sce.trustAsResourceUrl(path), type: "video/mp4"}
								];
	            }else{
	            	msg[0].path = (data.path).replace('app','..');
	            }
	            console.log(msg);
			}, 0);
		});
		
		$scope.toggleSmileysDiv=function(){
			if($scope.isShowSmileys){
				$scope.isShowSmileys=false;
				$scope.chatFormCls="chat-form";
				$scope.smileySrc="../images/smiley.png";
				setTimeout(function () {
					placeCaretAtEnd($("text-angular div[contenteditable=true]").get(0));
				}, 0);
			}else{
				$scope.isShowSmileys=true;
				$scope.chatFormCls="chat-form-small";
				$scope.smileySrc="../images/down-arrow.png";
			}
		};

        $scope.smileyPanes = [
            {
                active: true,
                emoticon: 'smile',
                emoticonsArray: configSrvc.emoticons1
            },
            {
                active: false,
                emoticon: 'cat',
                emoticonsArray: configSrvc.emoticons2
            },
            {
                active: false,
                emoticon: 'bamboo',
                emoticonsArray: configSrvc.emoticons3
            },
            {
                active: false,
                emoticon: 'house',
                emoticonsArray: configSrvc.emoticons4
            },
            {
                active: false,
                emoticon: 'one',
                emoticonsArray: configSrvc.emoticons5
            }
        ];

        $scope.toggleActive = function (tabIndex) {
            for(var i = 1; i <= $scope.smileyPanes.length; i++) {
                $scope.smileyPanes[i-1].active = (i == tabIndex);
            }
        };
		//get the contactId of the user to which we are trying to start chat.
		$scope.contactId = contactsSrvc.getSelectedContactForChat();
        console.log($scope.contactId);
		
		if(joinSrvc.mobileAndOtp.mobileNumber){
			userNumber = joinSrvc.mobileAndOtp.mobileNumber;
		}
		else{
			joinSrvc.getUserByUserId().then(function(userdata){
				userNumber = userdata.mobileNumber;
			});	
		}
		$scope.addEmoticon = function (obj,to,index) {
			var textarea = $("#txtAreaChat");
			
			var text = textarea.val();
			var emoticon = "<img class='emoji emoji_" + obj + "' title=':" + obj + ":' src='../images/blank.gif' />";
			textarea.val(text + emoticon);
			$timeout(function () {
				$scope.newMsg = text + emoticon;
				setTimeout(function () {
					placeCaretAtEnd($("text-angular div[contenteditable=true]").get(0));
				}, 10);
			}, 0);
			
		};
		$scope.newMsg;
		$scope.msgs = [];

        /**
         * Clicking on Home button will navigate to history page
         */
        $scope.gotoHistory = function () {
            $state.go('history');
        };

        /**
         * Clicking on Back button will navigate to history page
         */
        $scope.gotoContacts = function () {
            $state.go('contacts');
        };

		/**
		* Get the communicationId for the contact(with whom started chat).
		*/
        chatSrvc.getContactCommunicationIdMappings($scope.contactId).then(function (result) {
        	$scope.communicationId = result[0].communicationId;
        	localStorage.setItem(configSrvc.cmidLocalStorage,result[0].communicationId);
        	chatSrvc.getMessagesByCommunicationId($scope.communicationId).then(function(result){
        		console.log(result);
        		
        		contactsSrvc.getallContacts().then(function(contacts){
        			if(userNumber){
	        			$scope.getMessages(result,userNumber,contacts);
        			}
        			else{
        				joinSrvc.getUserByUserId().then(function(userdata){
							userNumber = userdata.mobileNumber;
							$scope.getMessages(result,userNumber,contacts);
						});	
        			}
        		});
        		
        		
        		
        		
        	});
        	//get the contact details to display the name on screen
			contactsSrvc.getChatContactDetails($scope.contactId).then(function(data){
				$scope.contactDetails=data[0];
				console.log('details')
				console.log(data[0]);
			});
        	//joinSrvc.getUserByUserId().then(function(userdata){
				//$scope.userdata = userdata;
			//});
		
        	/**
			* Place focus in chat message area using textAngularManager Service.
			*/
        	$timeout(function () {
        		var editorScope = textAngularManager.retrieveEditor('chatEditor').scope;
        		editorScope.displayElements.text[0].focus();
        	}, 1000);
        });
        $scope.getMessages=function(result,userNumber,contacts){
        	var finalResult=[];
    		var cnt=0;
        	angular.forEach(result,function(value,key){
    			console.log(value);
    			console.log(key);
    			cnt++;
    			if(value.to == userNumber){
    				console.log('if');
    				var contact = $filter('filter')(contacts,{contactNumber:value.from},true);
					value.fromLabel = contact.length>0?contact[0].contactName:value.from;
					finalResult.push(value);
    			}
    			else if(value.from != userNumber){
    				console.log('else if');
    				var contact = $filter('filter')(contacts,{contactNumber:value.from},true);
					value.fromLabel = contact.length>0?contact[0].contactName:value.from;
					finalResult.push(value);
    			}
    			else{
    				console.log('else');
    				value.fromLabel = "me";
    				finalResult.push(value);
    			}
    			console.log('modified');
    			console.log(value);
    			console.log(key);
    			if(cnt == result.length){
    				$scope.msgs=finalResult;
    				$scope.scrollMsgDivUp(0); 
    			}
			});
        };
		$scope.addMessage = function (isMedia,isVideo,data) {
			/**
			* Prepare an object with CommunicationId and the message to save in database.
			*/
			var doc = {};
			doc.communicationId = $scope.communicationId;
			doc.message = $scope.newMsg;
			doc.from = userNumber;
			doc.to=$scope.contactDetails.contactNumber;
			doc.on = new Date();
			doc.isMedia = isMedia;
			doc.isVideo=isVideo;
			if(isMedia){
				doc.mediaType=data.mediaType;
				doc.path=configSrvc.communicationFilesUplaodPath+data.communicationId+"/"+data.from+"/"+data.name;
			}
			/**
			* Emit the message to socket.
			*/
			socketio.emit('message', doc);
			
			
			/**
			* Call chatSrvc to add new message in database
			*/
			chatSrvc.addMessage(doc).then(function (result) {
			});
			/**
			* Add messages to array to show it on the window immediately.
			*/
			var docTemp = doc;
			docTemp.fromLabel='me';
			if(!isMedia){
				$scope.msgs.push(docTemp);
				$scope.scrollMsgDivUp(0);
			}
			/**
			* clear the chat message using textAngularManager service.
			*/
			var editorScope = textAngularManager.retrieveEditor('chatEditor').scope;
			editorScope.displayElements.text[0].innerHTML = '';
			/**
			* Clear the message in scope model
			*/
			$scope.newMsg = '';
		};
		$scope.scrollMsgDivUp=function(time){
			$timeout(function () { $("."+$scope.chatFormCls).animate({ scrollTop: $("."+$scope.chatFormCls).prop("scrollHeight") - $("."+$scope.chatFormCls).height() }, 100); }, time);
		};
		/**
		* Receive messages from the other user
		* Add the messages to array
		*/
		$scope.$on("MSG_RECEIVED", function (event,msg) {
			$timeout(function () {
				contactsSrvc.getallContacts().then(function(contacts){
					var contact = $filter('filter')(contacts,{contactNumber:msg.from},true);
					msg.fromLabel = contact.length>0?contact[0].contactName:msg.from;
					$scope.msgs.push(msg);
					$scope.scrollMsgDivUp(0);
				});
			}, 0);
		});
		/**
		 * Scope destroy event to remove the chat contact from the localStorage
		 */
		$scope.$on('$destroy', function() {
            contactsSrvc.removeSelectedContactForChat();
            chatSrvc.removeSelectedCommunicationIdForChat();
        });
		
	});
});
function placeCaretAtEnd(el) {
	el.focus();
	if (typeof window.getSelection != "undefined"
			&& typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}
