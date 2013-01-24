var IPAD = {};
IPAD.navigator = function () {
	function _navigate(where) {
		switch (where) {
			case "1":
			//search section
			CAB.navigator.setSection('search');
			break;
			case "2":
			//profile section
			CAB.navigator.setSection('myprofile');			
			break;
			case "3":
			//favorites section
			CAB.navigator.setSection('favorites');			
			break;
		}		
	}
	//initial navigation settings, search section
	var currentTab = 1,
	currentName = "nav_button" + currentTab,
	iconName = "icon_button" + currentTab,
	selectedElem = document.getElementById(currentName),
	selectedIconElem = document.getElementById(iconName),	
	obj = {};
	if (selectedElem != null) {
		selectedElem.className = "nav_button_selected";
	}
	if (selectedIconElem != null) {
		var filename = "images/" + selectedIconElem.getAttribute("name") + "_selected.png";
		selectedIconElem.style.backgroundImage = "url(" + filename + ")";
	}
	_navigate(currentTab);
	obj.setBadge = function (badge) {
		if (typeof badge != "object") {
			console.log("Badge is not a Object");
			return;
		}
		var currentElement = document.getElementById(currentName),
		currentIconElem = document.getElementById(iconName),
		selectedElement = currentElement,		
		selectedNumber = String.prototype.slice.call(badge.id,10,11);
		currentTab = selectedNumber;
		currentName = "nav_button" + currentTab;
		currentIconName = "icon_button" + currentTab;
		iconName = currentIconName;
		selectedElement = document.getElementById(currentName);
		selectedIconElem = document.getElementById(currentIconName);
		if (currentElement === selectedElement) {
			//do nothing
			return;
		}		
		if (currentElement != null) {
			currentElement.className = "nav_button";
			filename = "images/" + currentIconElem.getAttribute("name") + ".png";			
			currentIconElem.style.backgroundImage = "url(" + filename +")";
		}		
		if (selectedElement != null) {
			selectedElement.className = "nav_button_selected";
			filename = "images/" + selectedIconElem.getAttribute("name") + "_selected.png";
			selectedIconElem.style.backgroundImage = "url(" + filename +")";
		}
		//iPad navigation
		_navigate(currentTab);
	};//end of obj.betBadge	
	return obj;
} ();
