var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/app.js', function(req, res) {
    res.sendfile(__dirname + '/app.js');
});

io.sockets.on('connection', function(socket) {
    socket.emit('new:msg', 'AnonBoard에 잘 오셨어요!');

    socket.on('broadcast:msg', function(data) {
        // 새 메시지에 관해 자신을 제외한 나머지 모든 클라이언트에 전달
        socket.broadcast.emit('new:msg', data.message);
    });
});
