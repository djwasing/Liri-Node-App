require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var action = process.argv[2];
var file = require('file-system');
var fs = require('fs');
var media;




    switch (action) {
        case 'spotify-this-song':
            console.log(`Loading song info..........`);
            if (process.argv[3] === undefined) {
                console.log("You didn't enter a song title. Here's one for you: ");
                var songName = "The Sign Ace of Base";
                spotify(songName);
                break;
            }else{
            var songName = process.argv.slice(3).join(" ");
            spotify(songName);
            break;
            }
        case 'movie-this':
            console.log(`Loading movie info...........`);
            if (process.argv[3] === undefined) {
                console.log("You did not enter a movie title. Here's one for you: ");
                var movieTitle = "Mr. Nobody";
                movie(movieTitle);
                break;
            }else{
            var movieTitle = process.argv.slice(3).join(" ");
            movie(movieTitle);
            break;
            }
        case 'concert-this':
            console.log(`Loading concert info..........`);
            var artist = process.argv.slice(3).join(" ");
            concert(artist);
            break;
        case 'do-what-it-says':
            randomFile();
        default:
            break;
    }



// ------------- random.txt ----------------
// -----------------------------------------
function randomFile(err, data) {
    var data = fs.readFileSync('random.txt', 'utf8');
    var stringData = (data.toString());  
    var dataArr = stringData.split(',');
    action = dataArr[0];
    media = dataArr[1].trim();
    switch (action) {
        case 'spotify-this-song':
            console.log(`Loading song info..........`);
            var songName = media;
            spotify(songName);
            break;
        case 'movie-this':
            console.log(`Loading movie info...........`);
            var movieTitle = media;
            movie(movieTitle);
            break;
        case 'concert-this':
            console.log(`Loading concert info..........`);
            var artist = media;
            concert(artist);
            break;
    }
    if (err) {
        console.log('Error occurred: ' + err);
    }
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
    console.log(artist);
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
