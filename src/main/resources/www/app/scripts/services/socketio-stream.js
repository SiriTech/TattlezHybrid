define(['../modules/services'], function (services) {
'use strict';

    services.provider('socketiostream', function() {
        


        return {
            $get: function (configSrvc) {
            	var socketiostream = io.connect(configSrvc.serverURL+'/user');
                return socketiostream;
            }
        };
    });
});