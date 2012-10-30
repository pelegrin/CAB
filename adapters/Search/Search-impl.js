function trim (that) {
	return that.replace(/^\s+|\s+$/g,'');
};

function searchEmployee(searchString) {
	var searchArray,
		splitArray,
		resultArray = new Array(),
		searchResult,
		i,j;
	splitArray = searchString.split('OR');
	for (j = 0; j < splitArray.length; j++) {
		searchArray = new Array();
		for (i = 0; i < 4; i ++) {
			searchArray[i] = trim(splitArray[j]);
		}
		searchResult = WL.Server.invokeProcedure({
			adapter:'searchEmployee',
			procedure:'search',
			parameters:[searchArray]
		});
		resultArray = resultArray.concat(searchResult.resultSet); 
	}	
	return {result: resultArray};
	
	
}
