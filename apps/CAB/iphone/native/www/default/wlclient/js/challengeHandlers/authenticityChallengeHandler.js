
/* JavaScript content from wlclient/js/challengeHandlers/authenticityChallengeHandler.js in Common Resources */
// Creating a new challengeProcessor
var wl_authenticityChallengeHandler = WL.Client.createWLChallengeHandler("wl_authenticityRealm");
wl_authenticityChallengeHandler.handleChallenge = function(obj) {
    challenge = obj["WL-Challenge-Data"];
    if (challenge != null && WL.EnvProfile.isEnabled(WL.EPField.SUPPORT_CHALLENGE)) {
        var array = challenge.split('+');
        var someArgs = array[1].split('-');
        challenge = array[0];
        WL.App.__hashData(challenge, someArgs, authenticityChallengeResponse);
    }

    function authenticityChallengeResponse(data) {
        // Android return the string itself while iOS return object with string
        resultData = WL.Utils.getCordovaPluginResponseObject(data, "hashResult");
        wl_authenticityChallengeHandler.submitChallengeAnswer(resultData);
    }
};

wl_authenticityChallengeHandler.handleFailure = function(err) {
    WL.SimpleDialog.show(WL.ClientMessages.wlclientInitFailure, WL.ClientMessages.authFailure, [ {
        text : WL.ClientMessages.exit,
        handler : function() {
            WL.App.close();
        }
    } ]);
};
