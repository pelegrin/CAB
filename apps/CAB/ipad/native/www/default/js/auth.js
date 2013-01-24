
/* JavaScript content from js/auth.js in folder common */

/*
 *	This piece of code was added as a part of upgrading your application 
 *	to a new authentication API introduced in Worklight 5.0.0.3
 *		
 *	Authenticator object that was used previosly is deprecated.
 *	New challenge handler APIs are serving as a wrapper for original Authenticator object.
 *	To learn more about challenge handler APIs please refer to Worklight documentation.
 *
 */

// ----------------- Challenge handler start -----------------
var challengeHandler1 = WL.Client.createChallengeHandler("ProfileRealm");

challengeHandler1.isInitialized = false;
challengeHandler1.isCustomResponse = function(response) {
    if (typeof Authenticator == "undefined") {
        return false;
    }

    if (!this.isInitialized) {
        this.isInitialized = true;
        Authenticator.init();
    }

    var isLoginFormResponse = Authenticator.isLoginFormResponse(response);
    if (isLoginFormResponse) {
        Authenticator.onBeforeLogin(response, null, challengeHandler1.onSubmitButtonClicked);
        Authenticator.onShowLogin();
    } else {
        Authenticator.onHideLogin();
    }
    return isLoginFormResponse;
};

challengeHandler1.onSubmitButtonClicked = function(reqURL, authParams) {
    var options = {
        headers : {},
        parameters : (authParams && authParams.parameters) ? authParams.parameters : {}
    };

    challengeHandler1.submitLoginForm(reqURL, options, challengeHandler1.submitLoginFormCallback);
};

challengeHandler1.submitLoginFormCallback = function(response) {
    var isLoginFormResponse = challengeHandler1.isCustomResponse(response);
    if (!isLoginFormResponse) {
        challengeHandler1.submitSuccess();
    }
};
// ----------------- Challenge handler end -----------------

window.$ = WLJQ;
var Authenticator = function () {

    // Private members should be placed here
	var isCheckingPassword = false,
		busyIndicator = new WL.BusyIndicator(null,{text:'Checking login...'});
	
	function populateDataFirstTime (response) {
		WL.Logger.debug('populateDataFirstTime response=' + response);
		if (!!response.invocationResult.authRequered) {
			WL.Logger.debug('auth requered...');
    		return;			
		}
		//populate data first time in profile
		WL.Logger.debug('populate result first time is working...');
		var item = response.invocationResult.resultSet[0];
		$('#profileMain').attr('detailId',item.id);
		if (!!item.firstname) $('#Pname').text(item.firstname);
		else $('#Pname').text('Noname');
		if (!! item.lastname) $('#Plastname').text(item.lastname);
		else $('#Plastname').text('Nolastname');
		if (!!item.jobtitle) $('#Ptitle').text(item.jobtitle);
		else $('#Ptitle').text('No title');
		if (!!item.phone) $('#Pphonetext').text(item.phone);
		else $('#Pphonetext').text('No number');
		if (!!item.email) $('#Pemailtext').text(item.email);
		else $('#Pemailtext').text('No email');
	}
	
	function showError() {
		var error_page = CAB.navigator.getCurrentPage();
		$('#profileMain').hide();
		$('#profileAuth').show();
		$('#profilemessage').text('Failed to get profile at this time. Try later');		
		CAB.network.showNoConnection(error_page);
	}
	
	function login () {
		var invocationData = null,
			login = $('#profileLogin').val(),
			password = $('#profilePassword').val();			
		if (isCheckingPassword) return;
		isCheckingPassword = true;
		document.getElementById('profilebutton').style.backgroundImage='url(images/submit_button_on.png)';
		if (!busyIndicator.isVisible())
			busyIndicator.show();
		invocationData = {
				adapter : "getProfile",
				procedure : "login",
				parameters : [ {'login':login, 'password':password} ]
		};
		options = {
				onSuccess: populateDataFirstTime,
				onFailure: showError
		};
		WL.Client.invokeProcedure(invocationData, options);
		busyIndicator.hide();
		isCheckingPassword = false;
		document.getElementById('profilebutton').style.backgroundImage='url(images/submit_button.png)';
	}

    return {
        // Public members should be placed here
        init : function () {        	
        },

        isLoginFormResponse : function (response) {
           	if (!response || !response.responseJSON) 
        		return false;
           	WL.Logger.debug('isLoginFormResponse:' + response.responseJSON.authRequered);
           	return response.responseJSON.authRequered;
        },
        
        onBeforeLogin : function (response, username, onSubmit, onCancel) {
        	WL.Logger.debug('onBeforeLogin invoked');
        	$('#profilebutton').bind('click', login);
        	$('#profileLogin').val('');
        	$('#profilePassword').val('');
        	$('#profileUserId').empty();
        	if (response.responseJSON.errorMessage)
        		$('#profilemessage').html(response.responseJSON.errorMessage);
        },

       onShowLogin: function() {
    	   WL.Logger.debug('onShowLogin invoked');
    	   $('#profileMain').hide();
    	   $('#profileAuth').show('fast');
       },
        
       onHideLogin: function(){
    	   WL.Logger.debug('onHideLogin invoked');
           $('#profileAuth').hide('fast');
           //first load profile on page
           
           $('#profileMain').show('fast');
       }               
    }; 
}();
