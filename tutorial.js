sp = getSpotifyApi(1);

var models = sp.require('sp://import/scripts/api/models');
var views = sp.require('sp://import/scripts/api/views');

exports.init = init;

function init() {
    console.log("Initializing playlist");

    var player = new views.Player();
    var pl = new models.Playlist();
    var tl = new models.Toplist();

    tl.toplistType = models.TOPLISTTYPE.REGION;
    tl.matchType = models.TOPLISTMATCHES.TRACKS;
    tl.region = "US";
    tl.observe(models.EVENT.CHANGE, function(){
       console.log("Loaded " + tl.results.length +  " tracks");
       
       for(var i=0; i<20; i++){   
           pl.add(tl.results[i]);
       }
       
       player.track = pl.get(0);
       player.context = pl;
       $('#player').append(player.node);

       var plView = new views.List(pl);
       $('#player').append(plView.node);
    });

    tl.observe(models.EVENT.LOAD_ERROR, function(){
       console.log("Failed to load toplist");
    });

    tl.run();
}   
