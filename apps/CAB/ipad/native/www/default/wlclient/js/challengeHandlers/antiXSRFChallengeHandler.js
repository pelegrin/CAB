
/* JavaScript content from wlclient/js/challengeHandlers/antiXSRFChallengeHandler.js in Common Resources */
// Creating a new challengeProcessor
var wl_antiXSRFChallengeHandler = WL.Client.createWLChallengeHandler("wl_antiXSRFRealm");
wl_antiXSRFChallengeHandler.handleChallenge = function(obj) {
    WL.Client.addGlobalHeader("WL-Instance-Id", obj["WL-Instance-Id"]);
    this.submitChallengeAnswer();
};