var sp = getSpotifyApi(1);               

var models = sp.require('sp://import/scripts/api/models');
var views = sp.require('sp://import/scripts/api/views');
 
var player = new views.Player();

var activeLastFmUriCalls = 0;
var activeSpotifyCalls = 0;

var pl = null;
var liveFmTracks = null;
var spotifyTracks = null;



function getSongsForSelectedCountry(country) {
    $('.loading').show();

    $('#country_name').innerHTML = country
   	
   	liveFmTracks = new Array();
	spotifyTracks = new Array();

	RequestSpotifyTracksForCountry(country);
    RequestLastFmTracksForCountry(country);
}


function RequestSpotifyTracksForCountry(countryName){
	var tl = new models.Toplist();
	tl.toplistType = models.TOPLISTTYPE.REGION;
    tl.matchType = models.TOPLISTMATCHES.TRACKS;
    tl.region = getRegionCode(countryName);

    if(tl.region!= null){
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
		   --activeSpotifyCalls;    
	    });

	    ++activeSpotifyCalls;
	    tl.run();
	}
}

function getRegionCode(countryName){	
	console.log("Requesting Code for " + countryName);

	countryName = countryName.toUpperCase();
	
	switch(countryName)
	{
		case "UNITED STATES":
			return "US";
		case "DENMARK":
		  	return "DK";
		case "SPAIN":
		  	return "ES"; 
		case "FINLAND":
		  	return "FI";
		case "FRANCE":
			return "FR";
		case "UNITED KINGDOM":
			return "UK";
		case "NETHERLANDS":
			return "NL";
		case "NORWAY":
			return "NO";
		case "SWEDEN":
			return "SE";				 	 	 	
		case "AUSTRIA":
			return "AT";				 	 	 	
		case "SWITZERLAND":
			return "CH";				 	 	 	
		case "BELGIUM":
			return "BE";				 	 	 	

		default:
			return null;
	}
}

function RequestLastFmTracksForCountry(countryName){
	activeLastFmUriCalls++;

    var api_key = "3938d8cf503b62fcc4d3c616d2f99b48";
    var reqUrl = "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=" + countryName + "&limit=20&api_key="+api_key;
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
    },
	error: function(xml){
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

            	if(spotifyUri.length > 0){
            		var track = models.Track.fromURI(spotifyUri);
            		liveFmTracks.push(track);
            	}

				activeLastFmUriCalls--;
               	RefreshTracks();
            },
    error: function(xml){
			activeLastFmUriCalls--;
		}      
	});
}

function RefreshTracks(){

	if( activeLastFmUriCalls == 0 && activeSpotifyCalls == 0){
		//merge with existing play list
		console.log("**************liveFmTracks***************");
		for(var i=0;i<liveFmTracks.length;++i){
			console.log(liveFmTracks[i].name)
		}
		
		console.log("**************spotifyTracks***************");
		for(var i=0;i<spotifyTracks.length;++i){
			console.log(spotifyTracks[i].name)
		}
		
		var allTracks = new Array();
		var finalTracks = new Array();

		allTracks = allTracks.concat(liveFmTracks, spotifyTracks)
		
		for(var i=0; i<allTracks.length; ++i){
			finalTracks[allTracks[i].data.uri] = allTracks[i];
		}
		
		pl = new models.Playlist();
		for(key in finalTracks){
			pl.add(finalTracks[key]);
		}
		
		$('.loading').hide();

		if(pl.length > 0){
			player.track = pl.get(0);
			player.context = pl;
			var plView = new views.List(pl);
			$('#player').empty();
			$('#player').append(plView.node);
		}
	}
}

function CopyViewToNamedPlaylist(){
	var d = new Date();
	var countryName = $('.leaflet-popup-content').text();
	
	console.log("playlist length: " + pl.length);

	if(countryName.length > 0  && pl.length > 0){
		var newPlName = countryName + " " + d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear();
		var savedPl = new models.Playlist(newPlName);
		for(var i=0; i<pl.length; ++i) {
			savedPl.add(pl.get(i));
		}	
	}
}