
/* JavaScript content from wlclient/js/challengeHandlers/remoteDisableChallengeHandler.js in Common Resources */
var wl_remoteDisableChallengeHandler = WL.Client.createWLChallengeHandler("wl_remoteDisableRealm");

wl_remoteDisableChallengeHandler.handleChallenge = function(obj) {
    var message = obj.message;

    WL.SimpleDialog.show(WL.ClientMessages.notificationTitle, message, [ {
        text : WL.ClientMessages.close,
        handler : function() {
        	wl_remoteDisableChallengeHandler.submitChallengeAnswer(obj.messageId);
        }
    } ]);

    // TODO: ilan what to do here do we still save this?
    if (getEnv() != WL.Env.BLACKBERRY) {
        __WL.LocalStorage.setValue(WL.Client.LAST_NOTIFICATION_KEY, message);
    }
};

function getEnv() {
    return WL.StaticAppProps.ENVIRONMENT;
}

wl_remoteDisableChallengeHandler.handleFailure = function(err) {
    var message = err.message;
    var downloadLink = err.downloadLink;

    /*
     * Processor default handler for failure (display message and close App).
     */
    function defaultRemoteDisableDenialHandler() {
        var buttons = [ {
            text : WL.ClientMessages.exitApplication,
            handler : function() {
                // Note you must add the null options to openURL
                // otherwise the event is assumed the 3rd argument.
                WL.App.close();
            }
        } ];

        if (downloadLink) {
            buttons.push({
                text : WL.ClientMessages.getNewVersion,
                handler : function() {
                    // Note you must add the null options to openURL
                    // otherwise the event is assumed the 3rd argument.
                    WL.App.openURL(downloadLink, "_new", null);
                    WL.App.close();
                }
            });
        }
        // Patch - downloadNewVersion element is added in the msg string.
        WL.SimpleDialog.show(WL.ClientMessages.applicationDenied, message, buttons);
        WL.Client.__hideBusy();
    }

    WL.Client.__handleOnRemoteDisableDenial(defaultRemoteDisableDenialHandler);
};
