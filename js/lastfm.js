function getLastFmTopCountrySongs(countryName){
    var api_key = "3938d8cf503b62fcc4d3c616d2f99b48";
    var req = new XMLHttpRequest();
    var reqUrl = "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=" + countryName + " + &api_key="+api_key;

    console.log("Request: " + reqUrl);
    req.open("GET", reqUrl, false);
    req.onreadystatechange = function() {
        console.log("req status: " + req.status);
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.log("Search complete!");
                console.log(req.responseText);
            }
        }
    };
    req.send();
}   
