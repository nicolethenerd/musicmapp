function getLastFmTopCountrySongs(countryName){
    var api_key = "3938d8cf503b62fcc4d3c616d2f99b48";
    var reqUrl = "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=" + countryName + "&api_key="+api_key;
    console.log("Request: " + reqUrl);
    $.ajax({
    url: reqUrl,
    dataType: "xml",
    success: function(xml){
               $('track', xml).each(function(){
                   var songName =  $(this).find('>name').text();
                   var artistName =  $(this).find('artist>name').text();
                });
    }
 });
}
