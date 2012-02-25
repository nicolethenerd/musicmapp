sp = getSpotifyApi(1);

var models = sp.require('sp://import/scripts/api/models');
var views = sp.require('sp://import/scripts/api/views');

exports.init = init;

function init() {
    console.log("woohoo");
    var pl = new models.Playlist();
    var tracks = models.library.tracks;
    
    for (var i=0;i<20;i++){
        var track = models.Track.fromURI(tracks[i].data.uri);
        pl.add(track);
    }

    var player = new views.Player();
    player.track = pl.get(0);
    player.context = pl;
    player.image = null;   
    $('#player').append(player.node);

    var plView = new views.List(pl);
    $('#player').append(plView.node);
}   
