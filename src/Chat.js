import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";
import { FaPaperPlane } from 'react-icons/fa';


import './index.css'

function Chat({ socket, username, room }) {
    const [currMessage, setCurMessage] = useState("")
    const [msgList, setMsgList] = useState([]);

    const currTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        console.log(`${now} `);
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        const hours12 = hours % 12 || 12;

        // Pad the minutes with leading zero if needed
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        const time12Hr = `${hours12}:${paddedMinutes} ${ampm}`;
        return time12Hr;
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (currMessage !== "") {
            const msgData = {
                name: username,
                room: room,
                message: currMessage,
                time: currTime()
            }
            await socket.emit("send", msgData)
            setMsgList((list) => [...list, msgData]);
            setCurMessage("");
        }
    }
    const  clearChat = () =>{
        setMsgList([]);
    }
    const  leaveChat = () =>{
        window.location.reload();
    }

    useEffect(() => {
        socket.on('user-joined', (message) => {
            // Display the welcome message when a user joins the chat
            setMsgList((list) => [...list, { message }]);
          });
    
        socket.on('receive', (data) => {
            // console.log(data)
            setMsgList((list) => [...list, data]);
        })

        socket.on('user-left', (message)=>{
            setMsgList((list)=> [...list, { message}])
        })
        return () => {
            socket.off('receive');
            socket.off('user-joined');
            socket.off('user-left')
          };
    }, [socket])
    return (
        <div className='chat'>
            <h1 className='chathead'>Room : {room}</h1>
            <div className="cont">
                <ScrollToBottom className="chatwind">
                {msgList.map((messageContent, index) => {
                    return (
                        username === messageContent.name ? (
                        <div className='msg right' key={index}>
                            <div >{messageContent.message}</div>
                            <div className='msgtime'>{messageContent.time}</div>
                        </div> ) : (<div  className='msg left' key={index}>
                            <div className='msgname'>{messageContent.name}</div>
                            <div>{messageContent.message}</div>
                            <div className='msgtime'>{messageContent.time}</div>
                        </div>)

                        
                    );
                })}
                </ScrollToBottom>
            </div>
            <form className='chatform'>
                <input value={currMessage} type='text' onChange={(e) => { setCurMessage(e.target.value) }}  placeholder='Send message...' />
                <button onClick={sendMessage} ><FaPaperPlane/></button>
            </form>
            <div className='chatEnd'>
                <button onClick={clearChat}> Clear Chat</button>
                <button onClick={leaveChat}> Leave Room</button>
            </div>
        </div>


    )
}

export default Chat