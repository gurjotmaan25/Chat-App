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
      {/* <img src='https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8fA%3D%3D' alt='/'/> */}
      {!chatWindow ? (
      <form className='login'>
        <h1>Chat App</h1>
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
