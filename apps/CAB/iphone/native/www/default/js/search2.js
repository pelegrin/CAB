
/* JavaScript content from js/search2.js in folder common */
namespace('CAB.contactDetails').back = (function () {
	var isClicked = false;
	return function () {
		if (isClicked) return;
		isClicked = true;
		document.getElementById('backbutton').style.backgroundImage='url(images/back_button_on.png)';
		setTimeout(function () {
						document.getElementById('backbutton').style.backgroundImage='url(images/back_button.png)';			
						CAB.navigator.previousPage();
						isClicked = false;
					}, 250);
	};
})();


namespace('CAB.contactDetails').loadDetails = function (item) {
	CAB.contactDetails.currentItem = item;
	if (!!item.name) $('#name').text(item.name);
	else $('#name').text('Noname');
	if (!! item.lastname) $('#lastname').text(item.lastname);
	else $('#lastname').text('Nolastname');
	if (!!item.jobtitle) $('#title').text(item.jobtitle);
	else $('#title').text('No title');
	if (!!item.phone) $('#phonetext').text(item.phone);
	else $('#phonetext').text('No number');
	if (!!item.email) $('#emailtext').text(item.email);
	else $('#emailtext').text('No email');
};

namespace('CAB.contactDetails').addToFavorites = (function () {
	var isClicked = false;
	return function () {
		if (isClicked) return;
		isClicked = true;
		document.getElementById('favoritesbutton').style.backgroundImage='url(images/favorites_button_on.png)';
		setTimeout(function () {
			document.getElementById('favoritesbutton').style.backgroundImage='url(images/favorites_button.png)';
			WL.TabBar.setSelectedItem('favorites');
			CAB.navigator.setSection('favorites',CAB.contactDetails.currentItem);
			isClicked = false;
		}, 250);
	};
})();

namespace('CAB.contactDetails').where = (function () {
	var isClicked = false;
	return function () {
		if (isClicked) return;
		isClicked = true;
		document.getElementById('wherebutton').style.backgroundImage='url(images/where_button_on.png)';
		setTimeout(function () {
						document.getElementById('wherebutton').style.backgroundImage='url(images/where_button_off.png)';			
						WL.Logger.debug("Invoke native code...");
						WL.NativePage.show("WhereamiViewController", function () {WL.Logger.debug("Returned from Native");}, {});
						isClicked = false;
					}, 250);
	};
})();