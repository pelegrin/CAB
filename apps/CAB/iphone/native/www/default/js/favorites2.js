
/* JavaScript content from js/favorites2.js in folder common */
CAB.favorites.tocToDelete = [];
namespace('CAB.favorites').storage = (function () {
	var toc = [],
		storage = [];	
	_init();
	function _readStorage(counter,value) {
		try {
			storage[counter] = JSON.parse(value);
			_addToPage(storage[counter]);
		} catch (e) {
			WL.Logger.debug('Catch exception in toc parsing. Remove element from toc');
			//remove toc element, self healing
			var newToc = new Array(toc);
			newToc.splice(counter,1);
			var tocString = JSON.stringify(newToc);				
			CAB.favorites.write('toc',tocString);				
		};
	}
	
	function _initReadToc(tocValue) {
		var i = 0;
		try {
			toc = JSON.parse(tocValue);			
		} catch (e) {
			WL.Logger.debug('toc is empty');
			toc = [];
		}
		if (!!!toc  || !!!toc.length || toc.length === 0) {
			//print that there is no favorites
			$('#favoritesText').text('No entries in favorites');
			toc = [];
			return;
		}
		//clear No entries in favorites
		$('#favoritesText').text('');
		for (i = 0; i < toc.length; i++) {
			CAB.favorites.read(JSON.stringify(toc[i]), function (value) {				
				_readStorage(i,value);}
			);
		};
	}			
	
	function _init() {
		if (!CAB.favorites.isOpened()) {
			//back to favorites1.html
			CAB.navigator.previousPage();
			return;
		}
		CAB.favorites.tocToDelete = [];
		CAB.favorites.isDeleteMode = false;
		$('#Fdelnavigationbar').hide();
		//clear favorites list
		$('div.cell').remove();
		CAB.favorites.read('toc', _initReadToc);
		//check if we need to add in favorites
		if (!!CAB.favorites.toAdd) {
			_addToFavorites(CAB.favorites.toAdd);
			CAB.favorites.toAdd = null;
		}
		
	}
	
	//add, remove handler for entry in favorites list
	function _clickAddToDelete() {
		var contact = {},		
		isClicked = false,
		that = this;		
		contact.id = $(that).attr('detailId');
		that.style.backgroundColor = '#2946c1';
		that.style.color = '#FFFFFF';
		if (isClicked) return;
		isClicked = true;
		setTimeout(function () {
						that.style.backgroundColor = '#FFFFFF';
						that.style.color = '#4C4C4C';
						_addToDelete(contact.id);
						that.getElementsByClassName('icon')[0].style.backgroundImage = 'url(images/delete_on.png)';
						$(that).unbind();
						$(that).bind('click', _clickRemoveFromDelete);
						isClicked = false;
					}, 250);	
	}
	
	function _clickRemoveFromDelete() {
		var contact = {},		
		isClicked = false,
		that = this;
		contact.id = $(that).attr('detailId');
		that.style.backgroundColor = '#2946c1';
		that.style.color = '#FFFFFF';
		if (isClicked) return;
		isClicked = true;
		setTimeout(function () {
						that.style.backgroundColor = '#FFFFFF';
						that.style.color = '#4C4C4C';
						_removeFromDelete(contact.id);
						that.getElementsByClassName('icon')[0].style.backgroundImage = 'url(images/delete.png)';
						$(that).unbind();
						$(that).bind('click', _clickAddToDelete);						
						isClicked = false;
					}, 250);				
	}
	
	//functions to work with delete array
	function _addToDelete(id) {
		WL.Logger.debug('lenght of array before push =' + CAB.favorites.tocToDelete.length);
		CAB.favorites.tocToDelete.push(id);
		WL.Logger.debug('lenght of array after push =' + CAB.favorites.tocToDelete.length);
		WL.Logger.debug('add to delete:' + id);
	}
	
	function _removeFromDelete(id) {
		var i;
		for (i = 0; i < CAB.favorites.tocToDelete.length; i++) {
			if (CAB.favorites.tocToDelete[i] === id) {
				CAB.favorites.tocToDelete.splice(i,1);
				WL.Logger.debug('remove from delete:' + id);
				WL.Logger.debug('lenght of array after delete =' + CAB.favorites.tocToDelete.length);
				break;
			}
		}
	}
	
	//obj to save in storage 
	function _addToFavorites(obj) {
		var i = 0,
			length = (!!!toc || !!!toc.length || toc.length === 0)? 0:toc.length,
			idString ='',
			objString = '',
			tocString = '';
		//check for duplicate favorites
		
		if (length > 0) {
			for (i = 0; i < length; i++)
				if (obj.id === toc[i]) {
					WL.SimpleDialog.show('Can\'t add to favorites', obj.name + obj.lastname + ' is already in favorites', [{
						text: 'OK', handler: function () {WL.Logger.debug("OK button pressed");}
					}]);
					return;
				};
		}
		toc[length] = obj.id;
		storage[length] = obj;
		try {
			idString = JSON.stringify(obj.id);
			objString = JSON.stringify(obj);
			tocString = JSON.stringify(toc);
			CAB.favorites.write(idString,objString);
			CAB.favorites.write('toc',tocString);
			_addToPage(obj);
		} catch (e) {
			WL.Logger.debug('Can\'t save favorites');
		}
	}
	
	function _removeFromFavorites(obj) {
		if (obj === null) return;
		var idString,
			tocString ='',
			i;
		try {
			idString = JSON.stringify(obj);
			CAB.favorites.remove(idString);
			for (i = 0; i < toc.length; i++) {
				if (obj === toc[i]) {
					toc.splice(i,1);
					break;
				}
			}
			tocString = JSON.stringify(toc);
			CAB.favorites.write('toc',tocString);
		} catch (e) {
			WL.Logger.debug('Can\'t remove from favorites');
		}
	}
	
	function _addToPage(item) {
		var arrowElem = null,
		cellElem = null,
		titleElem = null,
		starElem = null,
		nameElem = null,
		lastElem = null,
		contentParent = $('#favoritesList');
		
		$('#favoritesText').text('');
		arrowElem = $('<div class="icon"></div>');
		cellElem = $('<div class="cell"></div>');			
		titleElem = $('<div class="title"></div>');
		nameElem = $('<span class="name"</span>');
		lastElem = $('<span class="lastname"></span>');
		starElem = $('<img src="images/favoritesStar.png" class="star" />');
		cellElem.attr('detailId',item.id);
		cellElem.attr('phone',item.phone);
		cellElem.attr('email',item.email);
		nameElem.html(item.name + " ");
		lastElem.html(item.lastname);			
		titleElem.html(item.jobtitle);
		cellElem.append(nameElem);
		cellElem.append(lastElem);
		cellElem.append(starElem);
		cellElem.append(titleElem);
		cellElem.append(arrowElem);
		cellElem.bind('click', function (){
			var contact = {},
				that = this,
				isClicked = false;
			contact.name = $(this).find('span.name').text();
			contact.lastname = $(this).find('span.lastname').text();
			contact.jobtitle = $(this).find('div.title').text();
			contact.phone = $(this).attr('phone');
			contact.email = $(this).attr('email');
			contact.id = $(this).attr('detailId');
			this.style.backgroundColor = '#2946c1';
			this.style.color = '#FFFFFF';
			if (isClicked) return;
			isClicked = true;
			setTimeout(function () {
							that.style.backgroundColor = '#FFFFFF';
							that.style.color = '#4C4C4C';
							CAB.navigator.nextPage(contact);
							isClicked = false;
						}, 250);
		});
		cellElem.hide();
		contentParent.append(cellElem);
		cellElem.show('fast');												
	}
	//one time activation code
	//add swipe gesture recognizer
	document.addEventListener("touchstart", function (event) {
		var touch = event.targetTouches[0];
		CAB.favorites.FirstX = touch.screenX;
		CAB.favorites.FirstY = touch.screenY;
		CAB.favorites.isMoveFixed = false;
		//event.preventDefault();
	}, false);
	document.addEventListener("touchmove", function (event) {
		if (CAB.navigator.isFavoritesSection()) return;
		var touch = event.targetTouches[0],
			delta = 0;			
		if (CAB.favorites.isMoveFixed)
			return;
		if (toc.length === 0)
			return;
		if (Math.abs(CAB.favorites.FirstY - touch.screenY)> 10){
			//cancel event
			CAB.favorites.isMoveFixed = true;
			return;
		}
		delta = Math.abs(CAB.favorites.FirstX - touch.screenX);
		if (delta > 30) {				
			var elems = $('div.icon'),
				items;
			event.preventDefault();
			if (CAB.favorites.isDeleteMode) {
				elems.css('background-image','url(images/arrow_icon.png)');
				$('#Fdelnavigationbar').hide();
				CAB.favorites.isDeleteMode = false;
				CAB.favorites.tocToDelete = [];
				CAB.favorites.isMoveFixed = true;
				return;
			}
			CAB.favorites.isMoveFixed = true;
			CAB.favorites.isDeleteMode = true;
			WL.Logger.debug('gesture detected!');
			$('#Fdelnavigationbar').show();
			$('#Fdeletebutton').text('Delete');				
			items = $('div.cell');
			items.unbind();
			items.bind('click', _clickAddToDelete);
			elems.css('background-image','url(images/delete.png)');
			return;
		};
	}, false);
	document.addEventListener("touchend", function (event) {
		if (CAB.favorites.isMoveFixed) {
			event.preventDefault();
			CAB.favorites.isMoveFixed = false;							
		}
	}, false);
	
	//public API
	return {
		reload: function (){
			CAB.favorites.isFirstLoaded = false;
			_init();
		},
		addToFavorites: function (item) {
				_addToFavorites (item);
		},
		removeFromFavorites: function () {
			var i;
			WL.Logger.debug('length of tocToDelete:' + CAB.favorites.tocToDelete.length);
			for (i = 0; i < CAB.favorites.tocToDelete.length; i++){
				WL.Logger.debug('id of deleting document ' + CAB.favorites.tocToDelete[i]);
				_removeFromFavorites(CAB.favorites.tocToDelete[i]);	
			}
			CAB.favorites.tocToDelete = [];
			$('#Fdelnavigationbar').hide('slow');
			this.reload();
		},
		removeMeFromFavorites: function (item) {
			_removeFromFavorites(item);
		}
	};
}) ();
