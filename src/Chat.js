import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { AttachFile, SearchOutlined } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from "firebase";
import { useStateValue } from "./StateProvider";
import "./Chat.css";

function Chat() {
    const [seed, setSeed] = useState('');
    const [input, setInput] = useState('');
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState('');
    const [messages, setMessages] = useState([]);
    const [otherUID, setOtherUID] = useState('');
    const [{ user }, dispatch] = useStateValue();
    const [messagedRoomId, setMessagedRoomId] = useState('');
    const dummy = useRef();

    useEffect(() => {
        if (roomId) {
            // console.log("USER EMAIL >>>", user.email);
            db
            .collection('users')
            .doc(user?.uid)
            .collection('friends')
            .doc(roomId)
            .onSnapshot(snapshot => {
                setRoomName(snapshot.data()?.name)
            })

            db
            .collection('users')
            .doc(user?.uid)
            .collection('friends')
            .doc(roomId)
            .onSnapshot(snapshot => {
                setOtherUID(snapshot.data()?.otherUID)
            })
            
            db
            .collection('users')
            .doc(user?.uid)
            .collection('friends')
            .doc(roomId)
            .onSnapshot(snapshot => {
                setMessagedRoomId(snapshot.data()?.otherRoomId)
            })

            db
            .collection('users')
            .doc(user?.uid)
            .collection('friends')
            .doc(roomId)
            .collection('messages')
            .orderBy('timestamps', 'asc')
            .onSnapshot(snapshot =>
                setMessages(snapshot.docs.map((doc) => doc.data()))
            );
        }
    }, [roomId]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        // console.log("You typed >>>", input);
        
        db
        .collection('users')
        .doc(user?.uid)
        .collection('friends')
        .doc(roomId)
        .collection('messages')
        .add({
            message: input,
            name: user.displayName,
            email: user.email,
            timestamps: firebase.firestore.FieldValue.serverTimestamp(),
        });

        db
        .collection('users')
        .doc(otherUID)
        .collection('friends')
        .doc(messagedRoomId)
        .collection('messages')
        .add({
            message: input,
            name: user.displayName,
            email: user.email,
            timestamps: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setInput("");
        dummy.current.scrollIntoView({ behavior: 'smooth' }); 
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>{new Date(messages[messages.length - 1]?.timestamps?.toDate()).toUTCString()}</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton >
                        <SearchOutlined />
                    </IconButton>
                    <IconButton >
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            {/* if the user is signed in, then his message should appear in green*/}
            <div id = "out" className="chat__body">
                {messages.map(message => (
                    <p className={`chat__message ${message.email === user.email && "chat__reciever"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {new Date(message.timestamps?.toDate()).toLocaleTimeString()}
                        </span>
                    </p>
                ))}
                <span id = "message_under" ref = {dummy}></span>
            </div>
            <div className="chat__footer">
                <IconButton >
                    <InsertEmoticonIcon />
                </IconButton>
                <form>
                    <input value={input} onChange={e => { setInput(e.target.value) }} placeholder="Type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <IconButton >
                    <MicIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat;
