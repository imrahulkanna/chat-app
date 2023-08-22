const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static(__dirname + '/public'));

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming messages
    socket.on('chat message', (message) => {
        io.emit('chat message', message); // Broadcast the message to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
