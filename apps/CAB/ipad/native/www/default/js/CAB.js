
/* JavaScript content from js/CAB.js in folder common */
window.$=WLJQ;
jQuery = WLJQ;
var namespace = function (ns_string) {
					if (typeof ns_string !== "string")
						throw ("namespace():invalid parameters");
					var parts = ns_string.split('.'),
					parent = this,
					i = 0;
					for (i;i<parts.length;i++) {
						if (typeof parent[parts[i]] ==='undefined')
							parent[parts[i]] = {};
						parent = parent[parts[i]];
					}
					return parent;
				},
	Messages = {};
	namespace('CAB.language');
	namespace('CAB.navigator');
	namespace('CAB.search');
	namespace('CAB.pageAnimator');
	namespace('CAB.favorites');

//wrapper for application api initialization
	
//-----------------------------------------
//API initialization	
	//because some message init goes before loading language pack
	CAB.language = (function () {
		var lang = "",
			api = {
				setRussian: function () {
					lang = "ru";
					//Need this function because Tab Bar initialization happens before language object Messages is redefined.
					Messages.ui_search = "Поиск";
					Messages.ui_myprofile = "Мой профиль";
					Messages.ui_favorites = "Предпочтения";
					Messages.search_PopUp = "Идет поиск...";
					Messages.searh_noresult = "Нет результатов";
					Messages.search_noconnection = "Нет соединения";
				},
				setEnglish: function () {
					lang = "en";
					//Also Need this function because some function initialization happens before language object Messages is redefined.
					Messages.ui_search = "Search";
					Messages.ui_myprofile = "My profile";
					Messages.ui_favorites = "Favorites";
					Messages.search_PopUp = "Searching...";
					Messages.searh_noresult = "No results";
					Messages.search_noconnection = "No connection";
				}			
			};
		return api;
	} ());
//-----------------------------------------
	CAB.navigator = (function () {
		var navigatorArray = null,
		currentPage = null,
		currentSection = null,
		currentState = null;
		
		function setPageInSection (section, page, context) {
			var i = 0,
				obj = null,
				secNumber = null,
				pagesInSection = null,
				animatorFunction = null,
				defaultAnimator = function (tagId, onCompleteFunc) {
									$('#' + tagId).toggle('slide', {}, 500, function () {
										if (typeof onCompleteFunc === 'function') 
											onCompleteFunc();
										}
									);
								};
			
			if (typeof section === 'string') {
				obj = section;
				for (i = 0; i < navigatorArray.length; i++) {
					if (obj === navigatorArray[i].name) {
						secNumber = i;
						break;
					}	
				}				
				if (typeof secNumber === 'undifined') 
					secNumber = 0;			
			}			
			else {			
				if (section > navigatorArray.length)
					section = 0;
				obj = navigatorArray[section].name;
				secNumber = section;
			}
			pagesInSection = navigatorArray[secNumber].pages;
			if (page === null || typeof page !== 'number' || isNaN(page) || page > pagesInSection.length) {			
				page = !!currentState[secNumber]? currentState[secNumber].number:0;
			}			
			if (!!!currentState[secNumber]) {
				//initialize a section and pages
				$('#content').prepend('<div id="' + obj + '"></div>');
				for (i = 0; i < pagesInSection.length; i++) 
					$('#' + obj).append('<div id="' + obj + '_page' +  i + '"></div>');
				animatorFunction = navigatorArray[secNumber].animator;
				currentState[secNumber] = pagesInSection[page];
			}
			if (secNumber === currentSection) {
				//change page on section
				//hide other page
				var oldPage = currentPage;
				currentPage = pagesInSection[page];
				if (oldPage.number === currentPage.number) return; //the same page and section already loaded
				currentState[secNumber] = currentPage;
				animatorFunction = (typeof pagesInSection[page].animator === 'function')? pagesInSection[page].animator: defaultAnimator;
				animatorFunction(obj + '_page' + oldPage.number, function () {
					loadPage(currentPage, obj, animatorFunction, context);				
					} );
			} else {
				//change section
				animatorFunction = navigatorArray[secNumber].animator;
				if (currentSection !== null)
					animatorFunction(navigatorArray[currentSection].name);				
				currentPage = currentState[secNumber];
				currentSection = secNumber;
				if (!!context && obj === 'favorites') {
					namespace('CAB.favorites').toAdd = context;
				}				
				WL.Fragment.load('pages/' + currentPage.filename,document.getElementById( obj + '_page' + currentPage.number), {
					onComplete: function () { 
									$('#' + obj).show('fast');
									afterLoadInSection(currentPage.number, obj);
								}
				});
			}		
		}
		
		function afterLoadInSection (page, section) {
			switch (section){
			case 'search':
				if (page === 1)
					CAB.contactDetails.loadDetails(CAB.contactDetails.currentItem);
				break;
			case 'favorites':
				if (page === 2)
					CAB.favoritesDetails.loadDetails(CAB.favoritesDetails.currentItem);
			}
		}
		
		function loadPage(page, section, animatorFunc, context) {
			WL.Fragment.load('pages/' + page.filename,document.getElementById(section + '_page' + page.number), {onComplete: 
						function () {
							if (!!context) {
								switch (section) {
								case 'search':
									CAB.contactDetails.loadDetails(context);
									break;
								case 'favorites':
									if (page.number === 1)
										CAB.favorites.storage.addToFavorites(context);
									else 
										CAB.favoritesDetails.loadDetails(context);
									break;
								}
							}
								
						}
			});
		}
		return {
			init: function (navMap) {
				var numOfSection;
				if (!navMap || navMap.length === 0) {
					WL.Logger.debug('Error in init navigation');
					return;	
				}
				numOfSection = navMap.length;
				navigatorArray = navMap;
				currentState = new Array(numOfSection);
				this.setSection(0);
			},
			nextPage: function (context) {
				var pagesInSection = navigatorArray[currentSection].pages,
				pageNum = currentPage.number + 1;
				if (pagesInSection.length - 1 < pageNum) {
					WL.Logger.debug('Error in page navigation');
					return;	
				}
				setPageInSection(currentSection, pageNum, context);
			},
			previousPage: function (context) {
				var pagesInSection = navigatorArray[currentSection].pages,
				pageNum = currentPage.number - 1;
				if (pagesInSection.length < 1 || pageNum < 0) {
					WL.Logger.debug('Error in page navigation');
					return;	
				}
				setPageInSection(currentSection, pageNum, context);
			},
			setSection: function (section, context) {						
				setPageInSection(section, null, context);
			},
			getCurrentPage: function () {
				return navigatorArray[currentSection].name;			
			},
			isFavoritesSection: function (){
				return (currentSection === 3);
			}
		};
	}) ();
//-----------------------------------------
	CAB.search = (function () {
		var searchValue = null,
			contentParent = null,
			busyIndicator = new WL.BusyIndicator(null,{'text': Messages.search_PopUp});
		function showError(){
			var error_page = CAB.navigator.getCurrentPage();
			WL.Logger.debug('error page:' + error_page);
			busyIndicator.hide();
			contentParent.empty();
			$('#welcometext').text(Messages.searh_noresult);
			$('#welcometext').show('slow');
			CAB.network.showNoConnection(error_page);
			WL.Logger.debug('showEror():No results');
		}
		function populateResults (response) {
			busyIndicator.hide();
			contentParent.empty();
			if (response.invocationResult.result.length === 0) {
				$('#welcometext').text(Messages.searh_noresult);
				$('#welcometext').show('slow');
				return;
			}
			$('#welcometext').text('');
			var items = response.invocationResult.result,
			arrowElem = null,
			cellElem = null,
			titleElem = null,
			i = 0;

			for (i; i< items.length; i++) {
				arrowElem = $('<div class="icon"></div>');
				cellElem = $('<div class="cell"></div>');			
				titleElem = $('<div class="title"></div>');
				nameElem = $('<span class="name"</span>');
				lastElem = $('<span class="lastname"></span>');
				cellElem.attr('detailId',items[i].id);
				cellElem.attr('phone',items[i].phone);
				cellElem.attr('email',items[i].email);
				nameElem.html(items[i].firstname + " ");
				lastElem.html(items[i].lastname);			
				titleElem.html(items[i].jobtitle);
				cellElem.append(nameElem);
				cellElem.append(lastElem);
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
				//cellElem.hide();
				contentParent.append(cellElem);
				//cellElem.show('fast');
			}							
		contentParent.show('slow');
		$('#welcometext').show('slow');
		}
		
		//public interface
		return { 
			init: function (obj) {
				if (obj && obj.searchElem && obj.parentElem) {
					searchValue = obj.searchElem;
					contentParent = obj.parentElem;
					return;
				}
				showError();
			},
			searchEmployee: function (){
				var invocationData = {
						adapter: "Search",
						procedure: "searchEmployee",
						parameters: [searchValue.val()]
				},
				options = {
						onSuccess: populateResults,
						onFailure: showError
				};			
				contentParent.hide('fast', function () {
					$('#welcometext').hide('fast');
					WL.Client.connect({onSuccess: function (){WL.Client.invokeProcedure(invocationData, options);}, onFailure: showError, timeout: 3000});
					}
					); 
				if (!busyIndicator.isVisible())
					busyIndicator.show();
			}
		};
	}());
//-----------------------------------------
	CAB.pageAnimator = function (tagId, onCompleteFunc) {
		$('#' + tagId).hide('fast', function () {
			if (typeof onCompleteFunc === 'function') 
				onCompleteFunc();
			}
		);
	};
//-----------------------------------------
	CAB.favorites.pinAnimator = function (tagId, onCompleteFunc) {
		$('#' + tagId).effect( 'drop', {}, 500, function () {
			if (typeof onCompleteFunc === 'function') 
				onCompleteFunc();
			} );
	};
//-----------------------------------------
	CAB.network = (function () {
		var isServerConnected = true,
			isNetworkAvaliable = true,
			callbacks = [];

		function changeNetworkStatus(status) {
			var i;
			isNetworkAvaliable = status.isNetworkConnected;
			for (i = 0; i < callbacks.length; i++)
				callback[i].apply(this,[isNetworkStatus]);
		}
		
		return {
			options: {
				timeout: 3000,
				connectOnStartup:true,
				onConnectionFailure: function (){
					wlEnvInit();
				}
			},
			isNetworkAvaliable: function () {
				WL.Device.getNetworkInfo(changeNetworkStatus);
				return isNetworkAvaliable;
			},
			isServerAvaliable: function () {
				return isServerConnected;
			},
			setServerIsNotAvaliable: function () {
				isServerConnected = false;
			},
			setServerIsAvaliable: function () {
				isServerConnected = true;
			},
			addNetworkCallback: function (callback) {
				if (typeof callback === 'function') {
					callbacks.push(callback);
				}
			},
			showNoConnection: function (item) {
				var ids = item + 'noconnection',
					elem;
				if (!!document.getElementById(ids)) {
					WL.Logger.debug('No connection Already exist');
					return;
				};
				WL.Logger.debug('show NoConnection ' + item);			
				elem = $('<div id="' + ids +'" class="noconnection"></div>');
				elem.hide();
				elem.text(Messages.search_noconnection);
				item = '#' + item;			
				$(item).append(elem);
				elem.show('clip',{},1000);
				isServerConnected = false;
			},
			hideNoConnection: function (item) {
				var ids = item + 'noconnection';
				if (!document.getElementById(ids)) {
					WL.Logger.debug('No connection Already hide');
					return;
				}
				WL.Logger.debug('hide NoConnection ' + item);		
				$('#' + ids).remove();
				isServerConnected = true;
			}
		};
	}) ();
	//return CAB API	


function wlCommonInit(){
    //set language
	var lang = WL.App.getDeviceLanguage();
	switch (lang) {	
	case "ru" :		
		WL.Fragment.load ("pages/rulanguage.html",
				document.getElementById("app_language"), {});
		CAB.language.setRussian();
		break;
	case "en" :
		CAB.language.setEnglish();
		break;
	default:
		CAB.language.setEnglish();
	}
}




/* JavaScript content from js/CAB.js in folder ipad */
window.$=WLJQ;
jQuery = WLJQ;
var namespace = function (ns_string) {
					if (typeof ns_string !== "string")
						throw ("namespace():invalid parameters");
					var parts = ns_string.split('.'),
					parent = this,
					i = 0;
					for (i;i<parts.length;i++) {
						if (typeof parent[parts[i]] ==='undefined')
							parent[parts[i]] = {};
						parent = parent[parts[i]];
					}
					return parent;
				},
	Messages = {};
	namespace('CAB.language');
	namespace('CAB.navigator');
	namespace('CAB.search');
	namespace('CAB.pageAnimator');
	namespace('CAB.favorites');

//wrapper for application api initialization
	
//-----------------------------------------
//API initialization	
	//because some message init goes before loading language pack
	CAB.language = (function () {
		var lang = "",
			api = {
				setRussian: function () {
					lang = "ru";
					//Need this function because Tab Bar initialization happens before language object Messages is redefined.
					Messages.ui_search = "Поиск";
					Messages.ui_myprofile = "Мой профиль";
					Messages.ui_favorites = "Предпочтения";
					Messages.search_PopUp = "Идет поиск...";
					Messages.searh_noresult = "Нет результатов";
					Messages.search_noconnection = "Нет соединения";
				},
				setEnglish: function () {
					lang = "en";
					//Also Need this function because some function initialization happens before language object Messages is redefined.
					Messages.ui_search = "Search";
					Messages.ui_myprofile = "My profile";
					Messages.ui_favorites = "Favorites";
					Messages.search_PopUp = "Searching...";
					Messages.searh_noresult = "No results";
					Messages.search_noconnection = "No connection";
				}			
			};
		return api;
	} ());
//-----------------------------------------
	CAB.navigator = (function () {
		var navigatorArray = null,
		currentPage = null,
		currentSection = null,
		currentState = null;
		
		function setPageInSection (section, page, context) {
			var i = 0,
				obj = null,
				secNumber = null,
				pagesInSection = null,
				animatorFunction = null,
				defaultAnimator = function (tagId, onCompleteFunc) {
									$('#' + tagId).toggle('slide', {}, 500, function () {
										if (typeof onCompleteFunc === 'function') 
											onCompleteFunc();
										}
									);
								};
			
			if (typeof section === 'string') {
				obj = section;
				for (i = 0; i < navigatorArray.length; i++) {
					if (obj === navigatorArray[i].name) {
						secNumber = i;
						break;
					}	
				}				
				if (typeof secNumber === 'undifined') 
					secNumber = 0;			
			}			
			else {			
				if (section > navigatorArray.length)
					section = 0;
				obj = navigatorArray[section].name;
				secNumber = section;
			}
			pagesInSection = navigatorArray[secNumber].pages;
			if (page === null || typeof page !== 'number' || isNaN(page) || page > pagesInSection.length) {			
				page = !!currentState[secNumber]? currentState[secNumber].number:0;
			} else {
				//currentState[secNumber] = pagesInSection[page];
			}
			if (!!!currentState[secNumber]) {
				//initialize a section and pages
				WL.Logger.debug('Initialize section and pages..current section=' + secNumber + ' current page=' + page);
				$('#main').prepend('<div id="' + obj + '"></div>');
				for (i = 0; i < pagesInSection.length; i++) 
					$('#' + obj).append('<div id="' + obj + '_page' +  i + '"></div>');
				animatorFunction = navigatorArray[secNumber].animator;
				currentState[secNumber] = pagesInSection[page];
			}						
			if (secNumber === currentSection) {
				//change page on section
				//hide other page
				WL.Logger.debug('Change page in section..current section=' + secNumber + ' current page=' + page);
				var oldPage = currentPage;
				currentPage = pagesInSection[page];
				if (oldPage.number === currentPage.number) return; //the same page and section already loaded
				currentState[secNumber] = currentPage;
				animatorFunction = (typeof pagesInSection[page].animator === 'function')? pagesInSection[page].animator: defaultAnimator;
				animatorFunction(obj + '_page' + oldPage.number, function () {
					loadPage(currentPage, obj, animatorFunction, context);				
					} );
			} else {
				//change section
				WL.Logger.debug('Change section..current section=' + secNumber + ' current page=' + currentState[secNumber]);
				animatorFunction = navigatorArray[secNumber].animator;
				if (currentSection !== null)
					animatorFunction(navigatorArray[currentSection].name);				
				currentPage = currentState[secNumber];
				currentSection = secNumber;
				if (!!context && obj === 'favorites') {
					namespace('CAB.favorites').toAdd = context;
				}
				//load left content area
				WL.Fragment.load('pages/' + obj + '_left.html',document.getElementById('left_content'),{});				
				WL.Fragment.load('pages/' + currentPage.filename,document.getElementById( obj + '_page' + currentPage.number), {
					onComplete: function () { 
									$('#' + obj).show('fast');
									afterLoadInSection(currentPage.number, obj);
								}
				});
			}		
		}
		
		function afterLoadInSection (page, section) {
			switch (section){
			case 'search':
				if (page === 1)
					CAB.contactDetails.loadDetails(CAB.contactDetails.currentItem);
				break;
			case 'favorites':
				if (page === 2)
					CAB.favoritesDetails.loadDetails(CAB.favoritesDetails.currentItem);
			}
		}
		
		function loadPage(page, section, animatorFunc, context) {
			WL.Fragment.load('pages/' + page.filename,document.getElementById(section + '_page' + page.number), {onComplete: 
						function () {
							if (!!context) {
								switch (section) {
								case 'search':
									CAB.contactDetails.loadDetails(context);
									break;
								case 'favorites':
									if (page.number === 1)
										CAB.favorites.storage.addToFavorites(context);
									else 
										CAB.favoritesDetails.loadDetails(context);
									break;
								}
							}
								
						}
			});
		}
		return {
			init: function (navMap) {
				var numOfSection;
				if (!navMap || navMap.length === 0) {
					WL.Logger.debug('Error in init navigation');
					return;	
				}
				numOfSection = navMap.length;
				navigatorArray = navMap;
				currentState = new Array(numOfSection);				
				this.setSection(0);
			},
			nextPage: function (context) {
				var pagesInSection = navigatorArray[currentSection].pages,
				pageNum = currentPage.number + 1;
				if (pagesInSection.length - 1 < pageNum) {
					WL.Logger.debug('Error in page navigation');
					return;	
				}
				WL.Logger.debug('nextPage: section=' + currentSection + ' page=' + pageNum);				
				setPageInSection(currentSection, pageNum, context);
			},
			previousPage: function (context) {
				var pagesInSection = navigatorArray[currentSection].pages,
				pageNum = currentPage.number - 1;
				if (pagesInSection.length < 1 || pageNum < 0) {
					WL.Logger.debug('Error in page navigation');
					return;	
				}
				WL.Logger.debug('previousPage: section=' + currentSection + ' page=' + pageNum);
				setPageInSection(currentSection, pageNum, context);
			},
			setSection: function (section, context, page) {						
				setPageInSection(section, page, context);
			},
			getCurrentPage: function () {
				return navigatorArray[currentSection].name;			
			},
			isFavoritesSection: function (){
				return (currentSection === 3);
			}
		};
	}) ();
//-----------------------------------------
	CAB.search = (function () {
		var searchValue = null,
			contentParent = null,
			busyIndicator = new WL.BusyIndicator(null,{'text': Messages.search_PopUp});
		function showError(){
			var error_page = CAB.navigator.getCurrentPage();
			WL.Logger.debug('error page:' + error_page);
			//switch search section to result screen, because can be in detail screen
			CAB.navigator.setSection('search',null,0);			
			busyIndicator.hide();
			contentParent.empty();
			contentParent.text(Messages.searh_noresult);
			contentParent.show('slow');
			CAB.network.showNoConnection(error_page);
			WL.Logger.debug('showEror():No results');
		}
		function populateResults (response) {
			var noresElem = null;
			//switch search section to result screen, because can be in detail screen
			CAB.navigator.setSection('search',null,0);
			busyIndicator.hide();
			contentParent.empty();
			if (response.invocationResult.result.length === 0) {
				WL.Logger.debug('no result returned');
				noresElem = $('<div id="noresult"></div>');
				contentParent.append(noresElem);
				contentParent.show('slow');
				return;
			}
			var items = response.invocationResult.result,
			arrowElem = null,
			cellElem = null,
			titleElem = null,
			i = 0;

			for (i; i< items.length; i++) {
				arrowElem = $('<div class="icon"></div>');
				cellElem = $('<div class="cell"></div>');			
				titleElem = $('<div class="title"></div>');
				nameElem = $('<span class="name"</span>');
				lastElem = $('<span class="lastname"></span>');
				cellElem.attr('detailId',items[i].id);
				cellElem.attr('phone',items[i].phone);
				cellElem.attr('email',items[i].email);
				nameElem.html(items[i].firstname + " ");
				lastElem.html(items[i].lastname);			
				titleElem.html(items[i].jobtitle);
				cellElem.append(nameElem);
				cellElem.append(lastElem);
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
				//cellElem.hide();
				contentParent.append(cellElem);
				//cellElem.show('fast');
			}							
			contentParent.show('slow');
		}
		
		//public interface
		return { 
			init: function (obj) {
				if (obj && obj.searchElem && obj.parentElem) {
					searchValue = obj.searchElem;
					contentParent = obj.parentElem;
					return;
				}
				showError();
			},
			searchEmployee: function (){
				var invocationData = {
						adapter: "Search",
						procedure: "searchEmployee",
						parameters: [searchValue.val()]
				},
				options = {
						onSuccess: populateResults,
						onFailure: showError
				};			
				contentParent.hide('fast', function () {
					WL.Client.connect({onSuccess: function (){WL.Client.invokeProcedure(invocationData, options);}, onFailure: showError, timeout: 3000});
					}
					); 
				if (!busyIndicator.isVisible())
					busyIndicator.show();
			}
		};
	}());
//-----------------------------------------
	CAB.pageAnimator = function (tagId, onCompleteFunc) {
		$('#' + tagId).hide('fast', function () {
			if (typeof onCompleteFunc === 'function') 
				onCompleteFunc();
			}
		);
	};
//-----------------------------------------
	CAB.favorites.pinAnimator = function (tagId, onCompleteFunc) {
		$('#' + tagId).effect( 'drop', {}, 500, function () {
			if (typeof onCompleteFunc === 'function') 
				onCompleteFunc();
			} );
	};
//-----------------------------------------
	CAB.network = (function () {
		var isServerConnected = true,
			isNetworkAvaliable = true,
			callbacks = [];

		function changeNetworkStatus(status) {
			var i;
			isNetworkAvaliable = status.isNetworkConnected;
			for (i = 0; i < callbacks.length; i++)
				callback[i].apply(this,[isNetworkStatus]);
		}
		
		return {
			options: {
				timeout: 3000,
				connectOnStartup:true,
				onConnectionFailure: function (){
					wlEnvInit();
				}
			},
			isNetworkAvaliable: function () {
				WL.Device.getNetworkInfo(changeNetworkStatus);
				return isNetworkAvaliable;
			},
			isServerAvaliable: function () {
				return isServerConnected;
			},
			setServerIsNotAvaliable: function () {
				isServerConnected = false;
			},
			setServerIsAvaliable: function () {
				isServerConnected = true;
			},
			addNetworkCallback: function (callback) {
				if (typeof callback === 'function') {
					callbacks.push(callback);
				}
			},
			showNoConnection: function (item) {
				var ids = item + 'noconnection',
					elem;
				if (!!document.getElementById(ids)) {
					WL.Logger.debug('No connection Already exist');
					return;
				};
				WL.Logger.debug('show NoConnection ' + item);			
				elem = $('<div id="' + ids +'" class="noconnection"></div>');
				elem.hide();
				elem.text(Messages.search_noconnection);
				item = '#' + item;			
				$(item).append(elem);
				elem.show('clip',{},1000);
				isServerConnected = false;
			},
			hideNoConnection: function (item) {
				var ids = item + 'noconnection';
				if (!document.getElementById(ids)) {
					WL.Logger.debug('No connection Already hide');
					return;
				}
				WL.Logger.debug('hide NoConnection ' + item);		
				$('#' + ids).remove();
				isServerConnected = true;
			}
		};
	}) ();
	//return CAB API	


function wlCommonInit(){
	//navMap array contains navigation structure [elems], where elem = {name: 'name', pages: [pages], animator: func}, where page = {nubmer, filename, animator}
	// filename is 'name' + page number;

	var map = [{name:'search', pages: [{number: 0, filename:'search1.html'},{number: 1, filename:'search2.html'}], animator: CAB.pageAnimator},
	           {name:'myprofile', pages: [{number:0, filename:'myprofile1.html'},{number:1, filename:'myprofile2.html'}], animator: CAB.pageAnimator},
	           {name:'favorites', pages: [{number:0, filename:'favorites1.html'},{number:1, filename:'favorites2.html',animator: CAB.favorites.pinAnimator}, {number:2, filename:'favorites3.html', animator: CAB.favorites.pageAnimator}], animator: CAB.pageAnimator}
		  ];
    CAB.navigator.init(map);
	
    //set language
	var lang = WL.App.getDeviceLanguage();
	switch (lang) {	
	case "ru" :		
		WL.Fragment.load ("pages/rulanguage.html",
				document.getElementById("app_language"), {});
		CAB.language.setRussian();
		break;
	case "en" :
		CAB.language.setEnglish();
		break;
	default:
		CAB.language.setEnglish();
	}
}



