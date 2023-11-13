import React, { useState } from 'react';
import io from 'socket.io-client';
import './index.css'
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");
function App() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [chatWindow, setChatWindow] = useState(false);

  const joinRoom = () =>{ 
    if(username !== "" && room!==""){
      socket.emit("join", room, username)
      setChatWindow(true)
    }
  }

  return (
    <div className="app">
      {!chatWindow ? (
      <form className='login'>
        <h1>Lohum Chat</h1>
          <input type='text' onChange={(e) => {setUsername(e.target.value)}} placeholder='Your Name... '/>
          <input type='text' onChange={(e) => {setRoom(e.target.value)}} placeholder='Room ID'/>
          <button  onClick={joinRoom}>Join Room</button>
      </form>
      ) : (
      <div className='chatCont'>
        <Chat socket={socket} username={username} room={room}/>
      </div>
      )}
    </div>
  );
}

export default App;
