
/* JavaScript content from wlclient/js/challengeHandlers/deviceAuthAutoProvisioningChallengeHandler.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
var wl_authAutoDeviceProvisioningChallengeHandler = WL.Client
        .createWLChallengeHandler("wl_authAutoDeviceProvisioningRealm");

wl_authAutoDeviceProvisioningChallengeHandler.handleChallenge = function(transport) {
    deviceChallengeToken = transport.responseJSON.deviceAuthentication.token;
    var deviceProvisioningSettings = {
        enabled : true,
        allowed : false,
        entity : "",
        realm : ""
    };

    if (WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_DEVICE_AUTH)) {
        deviceChallengeToken = transport.responseJSON.deviceAuthentication.token;
        // Extract deviceProvisioningEnabled, isProvisioningAllowed from
        // header
        // If no provisioning then deviceProvisioningEnabled = false
        // (default)
        deviceProvisioningSettings.enabled = true;
        deviceProvisioningSettings.allowed = (transport.responseJSON.deviceProvisioning.allowed == "true");
        deviceProvisioningSettings.entity = transport.responseJSON.deviceProvisioning.entity;
        deviceProvisioningSettings.realm = wl_authAutoDeviceProvisioningChallengeHandler.realm;
        deviceProvisioningSettings.token = transport.responseJSON.deviceAuthentication.token;

        WL.DeviceAuth.init(deviceProvisioningSettings, startDeviceProvisioningProcess, function() {
            WL.DeviceAuth.startDeviceAuth(deviceChallengeToken, deviceAuthSucceeded);
        });
    } else {
        WL.Logger.error("cannot handle device authentication");
        // do cancel
        wl_authAutoDeviceProvisioningChallengeHandler.submitFailure();
    }

    function startDeviceProvisioningProcess(csrData) {
        WL.DeviceAuth.createCSR({
            data : csrData
        }, function() {
            // Error handling - Cannot start csr process,
            // user did not state an implementation.
            WL.DiagnosticDialog.showDialog(WL.ClientMessages.wlclientInitFailure,
                    WL.ClientMessages.deviceAuthenticationFail, false, true, transport);
        });
    }

    function deviceAuthSucceeded(jwsHeader) {
        wl_authAutoDeviceProvisioningChallengeHandler.submitChallengeAnswer(jwsHeader);
    }
};

wl_authAutoDeviceProvisioningChallengeHandler.processSuccess = function(identity) {
};

wl_authAutoDeviceProvisioningChallengeHandler.handleFailure = function(err) {
};