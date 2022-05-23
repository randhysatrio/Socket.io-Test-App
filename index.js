const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  },
});

app.use(cors());
app.use(express.json());

// ChatPage V1
const loungeMessages = [];
const loungeRoomMessages = [];
const scienceMessages = [];
const scienceRoomMessages = [];

io.on('connection', (socket) => {
  console.log('A user has join');

  socket.on('Lounge', (data) => {
    console.log(data);
    io.emit('Lounge', `${data.name} has joined the Lounge`);
  });

  socket.on(`LoungeChat`, (data) => {
    console.log(data);
    loungeMessages.push(data);
    io.emit(`LoungeChat`, loungeMessages);
  });

  socket.on('Science', (data) => {
    io.emit('Science', `${data.name} has joined the Lounge`);
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnect');
  });
});

let users = [];

// const addUsers = (userID, socketID) => {
//   if (!users.find((user) => user.userID == userID)) {
//     users.push({ userID, socketID });
//   }
// };

// io.on('connection', (socket) => {
//   console.log('A user has connected');

//   socket.on('userJoin', (idusers) => {
//     addUsers(idusers, socket.id);
//     console.log(users);
//     io.emit('fetchUsers', users);
//   });

//   socket.on('sendMessage', ({ senderId, receiverId, receiverSocketId, text }) => {
//     console.log(receiverSocketId);
//     io.to(receiverSocketId).emit('getMessage', {
//       senderId,
//       receiverId,
//       text,
//       createdAt: Date.now(),
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('A user has disconnect');
//     const index = users.findIndex((user) => user.socketID == socket.id);
//     users.splice(index, 1);
//     console.log(users);
//     io.emit('fetchUsers', users);
//   });
// });

// code utk chatpage v1
// io.on('connection', (socket) => {
//   socket.on('userJoin', (data) => {
//     socket.broadcast.emit('userJoin', data.name);
//   });

//   socket.on('chatLounge', (data) => {
//     arrMsg.push(data);
//     io.emit('fetchChat', arrMsg);
//   });

//   socket.on('joinLounge', () => {
//     io.emit('fetchChat', arrMsg);
//   });

//   socket.on('joinScience', () => {
//     io.emit('fetchChatScience', arrMsg_science);
//   });

//   socket.on('chatScience', (data) => {
//     arrMsg_science.push(data);
//     io.emit('fetchChat', arrMsg_science);
//   });

//   socket.on('joinRoom', (data) => {
//     socket.join(data.room);
//     usersRoom1.push({ ...data, id: socket.id });
//     io.in(data.room).emit('roomNotif', `${data.name} has joined the room!`);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnect');
//   });
// });

const customChannel = io.of('/customchannel');

customChannel.on('connection', (socket) => {
  socket.on('joinChat', (data) => {
    console.log(`User connected in customChannel: ${data.name}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnect');
  });
});

httpServer.listen(7000, () => console.log('Server running at PORT 7000'));
