
/* JavaScript content from wlclient/js/deviceAuthentication.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2012. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * Object which handle the device authentication
 */
__WLDeviceAuth = function() {
    this.__requestToResend = null, this.__deviceChallengeToken = null,

    /**
     * Get payload from custom/default
     */
    this.startDeviceAuth = function(deviceAuthToken, isProvisioningEnabled, deviceAuthSucceeded) {
        WL.Client.__getCustomDeviceProperties(function(customPayloadJSON) {
            // The native code will add to the extenedPayloadJSON the app and
            // the
            // device
            var extenedPayloadJSON = {
                token : deviceAuthToken,
                custom : customPayloadJSON
            };
            WL.DeviceAuth.__createDeviceAuthHeader(
            // on success
    		function (result) {
                deviceAuthSucceeded(WL.Utils.getCordovaPluginResponseObject(result,"jwsHeader"));
    		},
            // on failure
            function() {
                // Error handling - Cannot create jws header
                WL.Logger.error("Device authentication: problem creating jws header", "");
                WL.DiagnosticDialog.showDialog(WL.ClientMessages.wlclientInitFailure, WL.ClientMessages.deviceAuthenticationFail, false,true, transport);
            }, 
            extenedPayloadJSON, isProvisioningEnabled, "replaceme");
        });
    },

    this.init = function(deviceProvisioningSettings, startProvisioningCallback, deviceAuthSucceeded) {
    	WL.DeviceAuth.__initDeviceAuthManager(
        // success callback
        function() {
        	initSuccess();
        },
        // failure callback
        function() {
            // Error handling - the auth header value is incorrect - we
            // cannot handle it
            WL.Logger.error("Problem initiailizeing AuthManager", "");
            WL.DiagnosticDialog.showDialog(WL.ClientMessages.wlclientInitFailure, WL.ClientMessages.deviceAuthenticationFail,
                    false, false);
        });

        function initSuccess() {
            // when there is no provisioning, just start auth, do not check if
            // there is a certificate
            if (!deviceProvisioningSettings.enabled) {
                WL.DeviceAuth.startDeviceAuth(deviceProvisioningSettings.token, deviceProvisioningSettings.enabled, deviceAuthSucceeded);
            } else {
            	WL.DeviceAuth.__isCertificateExists(
                // success callback
                function(result) {
                    var isCertificateExists = WL.Utils.getCordovaPluginResponseObject(result, "isCertificateExists");
                    isCertificateExists = ("true" == isCertificateExists);
                    if (isCertificateExists) {
                        // Get a reference to the correct onDeviceAuthPayload
                        // and invoke the success param using
                        // extra data if present
                        WL.DeviceAuth.startDeviceAuth(deviceProvisioningSettings.token);
                    } else if (!isCertificateExists && deviceProvisioningSettings.allowed) {
                        startProvisioningCallback();
                    }
                },
                // failure callback
                function() {
                    // Error handling - failed getting shouldStartDeviceAuth -
                    // logging is done in java code
                    WL.DiagnosticDialog.showDialog(WL.ClientMessages.wlclientInitFailure, WL.ClientMessages.deviceAuthenticationFail,
                            false, true, transport);
                });
            }
        }

    },

    /**
     * Check if the device has a certificate
     * 
     * @param successCallback
     * @param failureCallback
     */
    this.__isCertificateExists = function(provisioningEntitiy, successCallback, failureCallback) {
        cordova.exec(successCallback, failureCallback, "DeviceAuth", "isCertificateExists", [ provisioningEntitiy ]);
    },

    /**
     * Create the device auth header
     * 
     * @param payloadJSON -
     *            application JSON data
     * @param successCallback
     * @param failureCallback
     */
    this.__createDeviceAuthHeader = function(successCallback, failureCallback, payloadJSON, isProvisioningEnabled, provisioningEntitiy) {
        cordova.exec(successCallback, failureCallback, "DeviceAuth", "createDeviceAuthHeader", [payloadJSON, isProvisioningEnabled, provisioningEntitiy]);
    },

    /**
     * Create the device csr header We do not handle success because native code
     * will run the appropriate JS method when success happens
     * 
     * @param payloadJSON -
     *            application JSON data
     * @param failureCallback
     */
    this.createCSR = function(provisioningEntitiy, realm, csrData, failureCallback) {
        cordova.exec(null, failureCallback, "DeviceAuth", "createCSR", [ csrData, provisioningEntitiy, realm ]);
    },

    /**
     * Init the device with data pertinant to the authentication/provisioning
     * procedure
     * 
     */
    this.__initDeviceAuthManager = function(successCallback, failureCallback) {
        cordova.exec(successCallback, failureCallback, "DeviceAuth", "init", []);
    },

    /**
     * Default implementation for WL.Client.init's options
     * onGetCustomDeviceProperties. Our default implementation actually does
     * nothing. If overriding this method, the user must call
     * resumeDeviceAuthProcess with the payload
     * 
     * @param resumeDeviceAuthProcess
     *            function to call when done with getting extra data
     */
    this.__defaultOnGetCustomDeviceProperties = function(resumeDeviceAuthProcess) {
        resumeDeviceAuthProcess({});
    },

    /**
     * Default implementation for WL.Client.init's options
     * onGetCustomDeviceProvisioningProperties. Our default implementation
     * actually does nothing. If overriding this method, the user must call
     * resumeDeviceProvisioningProcess with the payload
     * 
     * @param resumeDeviceProvisioningProcess
     *            function to call when ready
     */
    this.__defaultOnGetCustomDeviceProvisioningProperties = function(resumeDeviceProvisioningProcess) {
        resumeDeviceProvisioningProcess({});
    };
};
__WL.prototype.DeviceAuth = new __WLDeviceAuth;
WL.DeviceAuth = new __WLDeviceAuth;
