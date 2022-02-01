const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(room);
console.log(username);
// join chat room
socket.emit('joinRoom',{username,room});

// Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    console.log(users);
    outputUsers(users);
})

// message from server
socket.on('message',message =>{
   outputMessage(message);
    // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
      // get message text
      const messg = e.target.elements.msg.value;
      console.log(messg);
      // emit message to server
      socket.emit('chatMessage',messg);

      // clear input
      e.target.elements.msg.value = '';
      e.target.elements.msg.focus();
})

// output message to DOM
const outputMessage = (message)=>{
    console.log(message);
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
     <p class="meta"><span class="usname"><i class="fas fa-user"></i> ${message.username}</span><span class="time"><i class="fas fa-user-clock"></i> ${message.time}</span></p>
     <p class="text"><i class="fal fa-comment-alt-lines"></i> ${message.text}</p>
    `
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
const outputRoomName = (room)=>{
roomName.innerText = room;
}
// add users to DOM
const outputUsers = (users)=>{
    userList.innerHTML = `
      ${users.map(user=>`<li><span class="dot"></span> ${user.username}</li>`).join('')}
    `
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});