//navMap array contains navigation structure [elems], where elem = {name: 'name', pages: [pages], animator: func}, where page = {nubmer, filename, animator}
// filename is 'name' + page number;

var map = [{name:'search', pages: [{number: 0, filename:'search1.html'},{number: 1, filename:'search2.html'}], animator: CAB.pageAnimator},
           {name:'myprofile', pages: [{number:0, filename:'myprofile1.html'},{number:1, filename:'myprofile2.html'}], animator: CAB.pageAnimator},
           {name:'favorites', pages: [{number:0, filename:'favorites1.html'},{number:1, filename:'favorites2.html',animator: CAB.favorites.pinAnimator}, {number:2, filename:'favorites3.html', animator: CAB.favorites.pageAnimator}], animator: CAB.pageAnimator}
	  ];

function wlEnvInit(){
    wlCommonInit();
    WL.TabBar.init();
    WL.TabBar.addItem('search', function () {    		
    		CAB.navigator.setSection('search');
    		CAB.network.hideNoConnection('search');
    	}, Messages.ui_search, {image:'images/lupa.png'});
    WL.TabBar.addItem('myprofile', function () {
    		CAB.navigator.setSection('myprofile');
    		CAB.network.hideNoConnection('myprofile');
    	}, Messages.ui_myprofile, {image:'images/me.png'});
    WL.TabBar.addItem('favorites', function () {
    		CAB.navigator.setSection('favorites');
    		CAB.network.hideNoConnection('favorites');
    	}, Messages.ui_favorites, {image:'images/star.png'});
    WL.TabBar.setSelectedItem('search');
    CAB.navigator.init(map);
    WL.TabBar.setVisible(true);
}

