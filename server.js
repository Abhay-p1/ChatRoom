const { Socket } = require('engine.io');
const express = require('express');
const app=express();
const http= require('http');
const server=http.createServer(app);
const path = require('path');
const socketio = require('socket.io');
const io = socketio(server);
const PORT=process.env.PORT || 5555;
const formatMessage = require('./public/js/formatmessage');
const {userJoin,getCurrUser,userLeave,getRoomUsers} = require('./public/js/users');

app.use(express.static(path.join(__dirname, 'public')));
// Run when a user connects
io.on('connection',(socket)=>{
    console.log('new Web socket connection');

    // join room
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room);
        console.log(username);
        socket.join(user.room);

       // welcome curr user
       socket.emit('message',formatMessage('Admin',"Welcome to Chat Room"));
       // Broadcast when a user connects
       socket.broadcast.to(user.room).emit('message',formatMessage('Admin',`${user.username} joined the room`));
       // send users in room info
       io.to(user.room).emit('roomUsers',{
           room:user.room,
           users:getRoomUsers(user.room),
       })
    })

    // run when client disconnects
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit(
                'message',
                formatMessage('Admin', `${user.username} has left the chat`)
              );
                // send users in room info
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room),
             })
        }
    })

    // Listen for chat message // we get at server
    socket.on('chatMessage',(messg)=>{
        const user = getCurrUser(socket.id);
         // emit back to client
         io.to(user.room).emit('message',formatMessage(user.username,messg));
    });

})
app.get("/",(req,res)=>{
    res.send("hola");
})
server.listen(PORT,()=>{
    console.log("Listening to port 5555");
})
