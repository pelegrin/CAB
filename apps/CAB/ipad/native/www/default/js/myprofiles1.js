
/* JavaScript content from js/myprofiles1.js in folder common */
namespace('CAB').myprofile = (function () {
	var mode = 'show';
		
	function isEditMode () {
		return mode === 'edit';
	}
	
	function editDone() {
		var elem = document.getElementById('PEditbutton');
		mode = 'show';
		WL.Logger.debug('Edit done');
		$('#PEditbutton').text('Edit');
		elem.style.backgroundColor = '#727272';
		elem.style.color = '#FFFFFF';
		$('#Pphotoadd').unbind();
		$('#Pphotoadd').hide('scale',{percent:0});
		$('#PEditbutton').unbind();
		$('#PEditbutton').bind('click', CAB.myprofile.editProfile);
		//invoke save procedure
	}
	
	function addPhoto() {
		navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
	}
	
	function captureSuccess(mediaFiles) {
		var path = mediaFiles[0].fullPath,
			photo =document.getElementById('Pplaceholder');
		photo.style.backgroundImage = 'url(' + path + ')';
		photo.style.backgroundSize = '91px';
		photo.style.backgroundRepeat = 'no-repeat';
		
	}
	
	function captureError() {
		WL.Logger.debug('Capture error invoked');
	}
	
	return {
		editProfile: function () {
			if (isEditMode()) return;
			mode = 'edit';
			WL.Logger.debug('Edit begin');
			var elem = document.getElementById('PEditbutton');			
			$('#PEditbutton').text('Done');
			elem.style.backgroundColor = '#2946c1';
			elem.style.color = '#FFFFFF';
			$('#PEditbutton').unbind();
			$('#PEditbutton').bind('click',editDone);
			$('#Pphotoadd').show('scale',{percent:100});
			$('#Pphotoadd').bind('click',function (){
				addPhoto();
			});
		}
	};
	
}) ();		

//startup sequence
(function () {
	var invocationData = {
			adapter : "getProfile",
			procedure : "myProfile",
			parameters : []
	},
	options = {
			onSuccess: populateProfile,
			onFailure: failedProfile,
			timeout: 3000
	},
	busyIndicator = new WL.BusyIndicator(null,{text:'Finding profile...'});
	//TODO:localize and load from language file
	//startup sequence
	busyIndicator.show();
	$('#profileMain').hide();
	$('#PEditbutton').text('Edit');
	$('#PEditbutton').bind('click',CAB.myprofile.editProfile);
	
	function populateProfile(response) {
		if (!(response.invocationResult.resultSet && response.invocationResult.resultSet.length > 0)) {
			WL.Logger.debug('No profile found in response');
			return;
		}
		busyIndicator.hide();
		$('#profileMain').show('slow');
		WL.Logger.debug('populate result is working...');
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
	
	function failedProfile (response) {
		var error_page = CAB.navigator.getCurrentPage();
		busyIndicator.hide();
		$('#profileMain').hide();
		$('#profileAuth').show();
		$('#profilemessage').text('Failed to get profile at this time. Try later');
		CAB.network.showNoConnection(error_page);
	}
	
	WL.Client.invokeProcedure(invocationData, options);
	busyIndicator.hide();
}) ();

