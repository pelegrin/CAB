namespace('CAB').favorites = (function (){
	var isCacheOpen = false,
		isCheckingPin = false,
		busyIndicator = new WL.BusyIndicator(null,{text:'Checking pin...'});
	
	function onCompleteOpenHandler (status) {
		document.getElementById('pinbutton').style.backgroundImage='url(images/submit_button.png)';
		switch (status) {
		case WL.EncryptedCache.OK:
			isCacheOpen = true;
			if (isCheckingPin) {
				busyIndicator.hide();
				if (!!CAB.favorites.toAdd) {
					CAB.navigator.nextPage(CAB.favorites.toAdd);
					CAB.favorites.toAdd = null;
				} else {
					CAB.navigator.nextPage();	
				}				
				isCheckingPin = false;
			}
			break;
		default:
			isCacheOpen = false;
			break;
		}
	}
	
	function onErrorOpenHandler (status) {
		var error_page = CAB.navigator.getCurrentPage();
		WL.Logger.debug("error open cache:" + status);
		switch (status) {
		case WL.EncryptedCache.ERROR_CREDENTIALS_MISMATCH:
			if (isCheckingPin) {
				busyIndicator.hide();				
				clearFavoritesPin();
				isCheckingPin = false;
			}
			break;
		case WL.EncryptedCache.ERROR_COULD_NOT_GENERATE_KEY:
			busyIndicator.hide();
			CAB.network.showNoConnection(error_page);
			isCheckingPin = false;
			isCacheOpen = false;
			break;
		default:
			isCacheOpen = false;
			break;
		}
	}	
	
	function onErrorReadHandler(status) {
		WL.Logger.debug("error when read cache:" + status);
	}
	
	function onCompleteReadHandler(value) {
		WL.Logger.debug("read from cache:" + value);
	}
	
	function clearFavoritesPin() {
		$('#infomessage').text('Incorrect pin code!!!, please enter pin');
		$('#pininput').val('');
		$('#pininput').effect( 'highlight', {}, 800, function () {
			$('#pininput').val('');
			} );
	}
	
	function emptyHandler() {
		//do nothing
	}

	return {
		isOpened: function () {
			return isCacheOpen;
		},
		create: function (enckey) {
			WL.EncryptedCache.open(enckey,true, onCompleteOpenHandler, onErrorOpenHandler);
		},
		read: function (key, callback){
			WL.Logger.debug("cache is open?" + isCacheOpen);
			if (isCacheOpen)
				return WL.EncryptedCache.read(key, callback, onErrorReadHandler);
			return null;
		},
		write: function (key, value){
			if (isCacheOpen) {
				WL.EncryptedCache.write(key, value, emptyHandler, emptyHandler);
				return true;
			}
			return false;
		},
		close: function () {
			WL.EncryptedCache.close(emptyHandler, emptyHandler);
			isCacheOpen = false;
		},
		remove: function (key) {
			WL.EncryptedCache.remove(key, emptyHandler, emptyHandler);
		},		
		deleteCache: function () {
			if (isCacheOpen) {
				WL.EncryptedCache.destroy(emptyHandler, emptyHandler);
				isCacheOpen = false;
				return true;
			}
			return false;
		},
		checkPin: function (pin) {
			if (isCheckingPin) return;
			isCheckingPin = true;
			document.getElementById('pinbutton').style.backgroundImage='url(images/submit_button_on.png)';
			if (!busyIndicator.isVisible())
				busyIndicator.show();
			this.create(pin);
		}
	};
}) ();

