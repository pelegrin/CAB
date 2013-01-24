
/* JavaScript content from js/favorites3.js in folder common */
namespace('CAB.favoritesDetails').back = (function () {
	var isClicked = false;
	return function () {
		if (isClicked) return;
		isClicked = true;
		document.getElementById('Fbackbutton').style.backgroundImage='url(images/back_button_on.png)';
		setTimeout(function () {
						document.getElementById('Fbackbutton').style.backgroundImage='url(images/back_button.png)';			
						CAB.navigator.previousPage();
						isClicked = false;
					}, 250);
	};
})();


namespace('CAB.favoritesDetails').loadDetails = function (item) {
	var isClicked = false;
	CAB.favoritesDetails.currentItem = item;
	if (!!item.name) $('#Fname').text(item.name);
	else $('#Fname').text('Noname');
	if (!! item.lastname) $('#Flastname').text(item.lastname);
	else $('#Flastname').text('Nolastname');
	if (!!item.jobtitle) $('#Ftitle').text(item.jobtitle);
	else $('#Ftitle').text('No title');
	if (!!item.phone) $('#Fphonetext').text(item.phone);
	else $('#Fphonetext').text('No number');
	if (!!item.email) $('#Femailtext').text(item.email);
	else $('#Femailtext').text('No email');
	$('#Ffavoritesbutton').text('Remove from favorites');
	$('#Ffavoritesbutton').unbind();
	$('#Ffavoritesbutton').bind('click', function () {
		var id = item.id,
			that = this;
		if (isClicked) return;
		isClicked = true;		
		this.style.backgroundColor = '#2946c1';
		this.style.color = '#FFFFFF';
		setTimeout(function (){
			that.style.backgroundColor = '#727272';
			that.style.color = '#FFFFFF';
			CAB.favorites.storage.removeMeFromFavorites(id);			
			CAB.navigator.previousPage();
			isClicked = false;
		}, 250);
	});
};
