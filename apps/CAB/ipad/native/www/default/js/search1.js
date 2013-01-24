
/* JavaScript content from js/search1.js in folder common */
if ( !($('#search_field').data('events') && $('#search_field').data('events').change)) {
	CAB.search.init({
		searchElem:$('#search_field'),
		parentElem:$('#bodytext')
	});
	$('#search_field').bind('change', CAB.search.searchEmployee);
};
document.getElementById('search_field').setAttribute('value',Messages.search_searchBar);
$('#welcometext').html(Messages.search_welcome);
/* JavaScript content from js/search1.js in folder ipad */
if ( !($('#search_field').data('events') && $('#search_field').data('events').change)) {
	$('#search_field').bind('change', CAB.search.searchEmployee);
};
CAB.search.init({
	searchElem:$('#search_field'),
	parentElem:$('#bodytext')
});
document.getElementById('search_field').setAttribute('value',Messages.search_searchBar);
$('#welcometext').html(Messages.search_welcome);
