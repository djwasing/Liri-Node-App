require("dotenv").config();
var keys = require("./keys.js");
// Spotify ---------------------
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var action = process.argv[2];


switch (action) {
    case 'spotify-this-song':
        var songName = process.argv[3];
        spotify(songName);
        break;
    case 'movie-this':
        var movieTitle = process.argv[3];
        movie(movieTitle);
        break;
    case 'concert-this':
        var artist = process.argv[3];
        concert(artist);
        break;

    default:
        break;
}


// ---------------- Spotify -----------------
// ------------------------------------------
function spotify(songName) {
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track' , query: songName }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
     }

    var song = data.tracks.items[0]; 
    console.log(`Artist: ${song.album.artists[0].name}`);
    console.log(`Song: ${song.name}`);
    console.log(`Preview URL: ${song.preview_url?song.preview_url:"No preview available"}`);
    console.log(`Album: ${song.album.name}`);
});
}


// -------------- OMDB ---------------
// -----------------------------------
function movie(movieTitle) {
    axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movieTitle}`)
    .then(function (response) {
      var x = response.data;
      console.log(`Title: ${x.Title}`);
      console.log(`Year: ${x.Year}`);
      console.log(`IMDB Rating: ${x.Ratings[0].Value}`);
      console.log(`Rotten Tomatoes Rating: ${x.Ratings[1].Value}`);
      console.log(`Country: ${x.Country}`);
      console.log(`Language: ${x.Language}`);
      console.log(`Plot: ${x.Plot}`);
      console.log(`Actors: ${x.Actors}`);
    })
    .catch(function (error) {
      console.log(error);
  });
}


// ----------------- Bands in Town Concert Lists -------------
// -----------------------------------------------------------
function concert(artist) {
axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
  .then(function (response) {
    console.log(`Venue Name: ${response.data[0].venue.name}`);
    console.log(`City: ${response.data[0].venue.city}`);
    console.log(`Date: ${moment(response.data[0].datetime).format("MM/DD/YYYY")}`);
  })
  .catch(function (error) {
    console.log(error);
});
}
