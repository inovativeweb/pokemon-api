var request = require('request');

file = require('./file');

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

request_api = function (msg, callback) {
    var resp = {};
    switch (msg.api) {
        case "request_http_pokemon":
            var options = '';
            request.get('https://pokeapi.co/api/v2/pokemon?offset=1&limit=1', options, function (err, res, body) { //find out pokemon count 
                if (res.statusCode === 200) {
                    console.log('find out pokemon count ')
                    raspuns = JSON.parse(body);
                    resp.count = raspuns.count
                    resp.random = randomIntFromInterval(1, (parseInt(resp.count - 1)))

                    request.get('https://pokeapi.co/api/v2/pokemon?offset=' + resp.random + '&limit=1', options, function (err, res, body) { //get pokemon url
                        if (res.statusCode === 200) {
                            console.log('get pokemon url on ' + 'https://pokeapi.co/api/v2/pokemon?offset=' + resp.random + '&limit=1')
                            resp.data = body;
                            raspuns = JSON.parse(body);
                            url = raspuns.results[0]
                            resp.pokemon_url = url.url
                                    request.get(  resp.pokemon_url, options, function (err, res, body) {  //get pokemon data
                                        if (res.statusCode === 200) {
                                            console.log('get pokemon data on ' +  resp.pokemon_url)
                                             resp.pokemon = body;
                                            pokemon = JSON.parse(resp.pokemon);
                                            sprites = ( pokemon.sprites);
                                                    for (var key in sprites){
                                                        if(sprites[key]){
                                                            image = sprites[key]
                                                        }
                                                    }
                                                file.download_file(image, 'assets/img/'+pokemon.id+'.png');   
                                            

                                            resp.content = "https_raspuns_pokemon";
                                            callback(resp);   //return data
                                        } else {
                                            console.error('error:', err); // Print the error if one occurred
                                            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                                        }
                    
                                  });

                  

                        } else {
                            console.error('error:', err);
                            console.log('statusCode:', response && response.statusCode);
                        }
                    });



                } else {
                    console.error('error:', err); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode);
                }
            });

            break;
    }

}

module.exports.request_api = request_api;