const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let userCount = 0;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  userCount++;
  io.emit('userCount', userCount);

  socket.on('chat message', (message) => {
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    userCount--;
    io.emit('userCount',userCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
