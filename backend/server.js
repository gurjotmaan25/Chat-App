const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express()

app.use(cors())

const io = new Server(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const rooms = new Map()
const users = {}

io.on('connection', (socket) => {

    socket.on("join", (room, username) => {
        // Search if room exist, if not then create one and initialize it as an empty Set
        if (!rooms.has(room)) {
            rooms.set(room, new Set())
        }
        // Add current socket's id in particular room
        rooms.get(room).add(socket.id)
        // Here socket join specific room
        socket.join(room);

        users[socket.id] = username

         // Broadcast a message to all users in the specific room
        socket.to(room).emit('user-joined', `${username} joined the chat`);

    });

    socket.on('send', (data) => {
        // Send the received message to all users in the specified room
        socket.to(data.room).emit('receive', data)
    });

    socket.on('disconnect', () => {
        //we want to display users that left we fetch that name from users object
        const username = users[socket.id]
        if (username) {
            delete users[socket.id]
        }

        rooms.forEach((users, room) => {
            if (users.has(socket.id)) {
                socket.to(room).emit('user-left', `${username} left the chat`);
                users.delete(socket.id);

                // if the room becomes empty, delete it
                if (users.size === 0) {
                    rooms.delete(room);
                }
            }
        });

    });
});
console.log('connected');