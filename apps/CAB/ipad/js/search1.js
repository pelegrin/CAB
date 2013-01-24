if ( !($('#search_field').data('events') && $('#search_field').data('events').change)) {
	$('#search_field').bind('change', CAB.search.searchEmployee);
};
CAB.search.init({
	searchElem:$('#search_field'),
	parentElem:$('#bodytext')
});
document.getElementById('search_field').setAttribute('value',Messages.search_searchBar);
$('#welcometext').html(Messages.search_welcome);
