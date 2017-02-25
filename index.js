'use strict';

// define globals
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + "/public/"));
var id = 0;
var data = [];
var MAX_LONG_POLL_TIME = 3000;
var reqCount = 0;

app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); 
});

app.post('/getMessage', function (req, res) {

    var lastId = req.body.id;
    // console.log(lastId);
    var dataObj = [];
    lastId = parseInt(lastId);
    if (lastId + 1 < data.length) {
        for (var i = lastId+1; i < data.length; i++) {
            dataObj.push(data[i]);
        }
    }
    // console.log(dataObj);
    res.send(dataObj);
    // var time = Date.now();
    // pollingFunction(res, time);


});
app.post('/sendMessage', function (req, res) {
    var userName = req.body.userName;
    var message = req.body.message;
    var obj = {};
    obj.userName = userName;
    obj.message = message;
    obj.id = id++;
    data.push(obj);
    // console.log(data);
    res.send(obj);
});

app.get('/getUserName', function (req, res) {
    reqCount++;
    var obj = {};
    obj.userName = "User" + reqCount;
    res.send(obj);
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});


function pollingFunction(res, time) {
    if (dataCurrentLength == dataLength) {
        var currentTime = Date.now();
        if ((currentTime - time) < MAX_LONG_POLL_TIME) {
            setTimeout(function () {
                pollingFunction(res, time)
            }, 100);
        }
        else {
            res.send();
        }
    }
    else {
        dataLength++;
        var obj = {};
        obj.message = data[data.length - 1].message;
        obj.user = data[data.length - 1].userName;
        res.send(obj);
    }
}