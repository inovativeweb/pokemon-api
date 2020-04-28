var http = require('https');
var fs = require('fs');


var download_file = function (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        console.log(url);
        response.pipe(file);
        file.on('finish', function () {
            console.log('File saved on ' + dest);
            file.close(cb);
        });
    });
}

module.exports.download_file = download_file;