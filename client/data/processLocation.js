var locationTuples = [];

var getLocation = function() {
  //500 tweets processed out of ~2000
  for(var i = 0; i < 500; i++) {
    locationTuples.push([locationTweets[i].latitude, locationTweets[i].longitude]);
  }
  return locationTuples;
};
