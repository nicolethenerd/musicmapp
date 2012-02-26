var sp = getSpotifyApi(1);               

var models = sp.require('sp://import/scripts/api/models');
var views = sp.require('sp://import/scripts/api/views');
 
var player = new views.Player();

var activeLastFmUriCalls = 0;
var activeSpotifyCalls = 0;

var liveFmTracks = null;
var spotifyTracks = null;

function getSongsForSelectedCountry() {
    var country = $('.leaflet-popup-content').text();

    $('#country_name').innerHTML = country
   	
   	liveFmTracks = new Array();
	spotifyTracks = new Array();
	RequestSpotifyTracksForCountry('mexico');
    RequestLastFmTracksForCountry('mexico');
}

function RequestSpotifyTracksForCountry(countryName){
	var tl = new models.Toplist();
	tl.toplistType = models.TOPLISTTYPE.REGION;
    tl.matchType = models.TOPLISTMATCHES.TRACKS;
    tl.region = "US";

    tl.observe(models.EVENT.CHANGE, function(){
	       console.log("Loaded " + tl.results.length +  " tracks");
	       
	       for(var i=0; i<20; i++){   
	       	   spotifyTracks.push(tl.results[i]);
	       }
	       --activeSpotifyCalls;    
	       RefreshTracks();
    	});

    tl.observe(models.EVENT.LOAD_ERROR, function(){
       console.log("Failed to load toplist");
    });

    ++activeSpotifyCalls;
    tl.run();
}

function getRegionCode(countryName){
	//add switch for all spotify countries
}

function RequestLastFmTracksForCountry(countryName){
	activeLastFmUriCalls++;

    var api_key = "3938d8cf503b62fcc4d3c616d2f99b48";
    var reqUrl = "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=" + countryName + "&api_key="+api_key;
    $.ajax({
    url: reqUrl,
    dataType: "xml",
    success: function(xml){
    			$('track', xml).each(function(){
                   var songName =  $(this).find('>name').text();
                   var artistName =  $(this).find('artist>name').text();
				   getSpotifyURI(songName, artistName);
                });
                activeLastFmUriCalls--;
    }
 });
}

function getSpotifyURI(songName, artistName){
	activeLastFmUriCalls++;

    var api_key = "3938d8cf503b62fcc4d3c616d2f99b48";
    var reqUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getPlaylinks&artist[]=" + artistName +"&track[]=" + songName + "&api_key="+api_key;
    $.ajax({
    url: reqUrl,
    dataType: "xml",
    success: function(xml){
     		    $('externalids', xml).each(function(){
                   spotifyUri = $(this).text();
                });

     		    console.log("spotifyUri: " + spotifyUri);

            	if(spotifyUri.length > 0){
            		var track = models.Track.fromURI(spotifyUri);
            		liveFmTracks.push(track);
            		console.log("liveFmTracks.length" + liveFmTracks.length);
            	}

				activeLastFmUriCalls--;
               	RefreshTracks();
            }
      });
}

function RefreshTracks(){
	if(activeLastFmUriCalls == 0 && activeSpotifyCalls == 0){
		//merge with existing play list
		console.log("**************liveFmTracks***************");
		for(var i=0;i<liveFmTracks.length;++i){
			console.log(liveFmTracks[i].name)
		}
		
		console.log("**************spotifyTracks***************");
		for(var i=0;i<spotifyTracks.length;++i){
			console.log(spotifyTracks[i].name)
		}
		
		var pl = new models.Playlist();
		var allTracks = new Array();
		allTracks = allTracks.concat(liveFmTracks, spotifyTracks);

		for(var i=0; i<allTracks.length; ++i){
			pl.add(allTracks[i]);
		}

		player.track = pl.get(0);
		player.context = pl;
		var plView = new views.List(pl);
		$('#player').empty();
		$('#player').append(plView.node);
	}
}