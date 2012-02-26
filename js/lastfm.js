function getLastFmTopCountrySongs(countryName){
    var api_key = "3938d8cf503b62fcc4d3c616d2f99b48";
    var reqUrl = "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=" + countryName + "&api_key="+api_key;
    var uris = new Array();

    console.log("Request: " + reqUrl);
    $.ajax({
    url: reqUrl,
    dataType: "xml",
    success: function(xml){
               $('track', xml).each(function(){
                   var songName =  $(this).find('>name').text();
                   var artistName =  $(this).find('artist>name').text();
                   var uri = getSpotifyURI(songName, artistName);
                   console.log(uri);
                   var i = 0;
                   if(uri!="-1") {
                      uris[i] = uri;
                      i++;
                   }
                });
             }
    });
    //console.log(uris);
    return uris;
}

function getSpotifyURI(songName, artistName){
  var api_key = "3938d8cf503b62fcc4d3c616d2f99b48";
    var reqUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getPlaylinks&artist[]=" + artistName +"&track[]=" + songName + "&api_key="+api_key;
    console.log("Request: " + reqUrl);
    $.ajax({
    url: reqUrl,
    dataType: "xml",
    success: function(xml){
               $('spotify', xml).each(function(){
                   return $(this).text();
                });
            }
      });
    return "-1";
}
