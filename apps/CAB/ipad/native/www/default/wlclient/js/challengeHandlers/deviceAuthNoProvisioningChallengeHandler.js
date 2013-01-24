
/* JavaScript content from wlclient/js/challengeHandlers/deviceAuthNoProvisioningChallengeHandler.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
var wl_noDeviceProvisioningChallengeHandler = WL.Client.createWLChallengeHandler("wl_deviceNoProvisioningRealm");

wl_noDeviceProvisioningChallengeHandler.handleChallenge = function(transport) {
    var deviceProvisioningSettings = {
        enabled : false,
        allowed : false,
        entity : "",
        realm : this.realm,
        token : transport.token
    };

    WL.DeviceAuth.init(deviceProvisioningSettings, function() {
    }, function(jwsHeader) {
        wl_noDeviceProvisioningChallengeHandler.submitChallengeAnswer(jwsHeader);
    });
};

wl_noDeviceProvisioningChallengeHandler.processSuccess = function(identity) {

};

wl_noDeviceProvisioningChallengeHandler.handleFailure = function(err) {

};