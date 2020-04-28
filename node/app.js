var express = require('express');
var path = require('path');
var fs = require('fs');
var WebSocket = require('ws');

var app = express();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, '/assets')));

db = require('./db');
api = require('./api');


var wss = new WebSocket.Server({ port: 8088 });


wss.on('connection', (ws) => {
    ws.on('message', rmsg => {
        console.log('WebSocket received ' + rmsg);
        var msg = JSON.parse(rmsg);
        if (msg.hasOwnProperty('command')) db.request_db(msg, (result, err) => {
            if (err) console.log(err);
            else {
                ws.send(JSON.stringify(result));
            }
        });
        else if(msg.hasOwnProperty('api')) api.request_api(msg, (result, err) => {
            if (err) console.log(err);
            else {
                ws.send(JSON.stringify(result));
            }  
        });
    });

    ws.on('close', () => {
        console.log('WebSocket was closed');
    });
});


app.listen('3000', () => {
    console.log('Server started on port 3000...');
});


app.get('/index.html', (req, res) => {
    res.render('index');
});


app.get('/team/:team_id/edit', function (request, response, next) {
    var team_id = request.params.team_id;
    response.render('edit',  { team_id: team_id });
});


app.get('/', (req, res)  => {
    res.render('index');
});

app.get('/team/create', (req, res)  => {
    res.render('create');
});

app.get('/team/list', (req, res)  => {
    res.render('list');
});



