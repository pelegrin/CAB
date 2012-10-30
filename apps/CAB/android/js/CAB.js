//navMap array contains navigation structure [elems], where elem = {name: 'name', pages: [pages], animator: func}, where page = {nubmer, filename, animator}
var map = [{name:'search', pages: [{number: 0, filename:'search1.html'},{number: 1, filename:'search2.html'}], animator: CAB.pageAnimator},
           {name:'myprofile', pages: [{number:0, filename:'myprofile1.html'},{number:1, filename:'myprofile2.html'}], animator: CAB.pageAnimator},
           {name:'favorites', pages: [{number:0, filename:'favorites1.html'},{number:1, filename:'favorites2.html',animator: CAB.favorites.pinAnimator}, {number:2, filename:'favorites3.html', animator: CAB.favorites.pageAnimator}], animator: CAB.pageAnimator}
	  ];

function wlEnvInit(){
    //wlCommonInit();
    WL.TabBar.setParentDivId('tabBar');
    WL.TabBar.init();
    WL.TabBar.addItem('search', function () {    		
    		CAB.navigator.setSection('search');
    		CAB.network.hideNoConnection('search');
    	}, 'Search', {image:'images/search_a.png', imageSelected:'images/search_on.png'});
    WL.TabBar.addItem('myprofile', function () {
    		CAB.navigator.setSection('myprofile');
    		CAB.network.hideNoConnection('myprofile');
    	}, 'My profile', {image:'images/myprofile.png', imageSelected:'images/myprofile_on.png'});
    WL.TabBar.addItem('favorites', function () {
    		CAB.navigator.setSection('favorites');
    		CAB.network.hideNoConnection('favorites');
    	}, 'Favorites', {image:'images/favorites.png', imageSelected:'images/favorites_on.png'});
    WL.TabBar.setSelectedItem('search');
    CAB.navigator.init(map);
    WL.TabBar.setVisible(true);
}