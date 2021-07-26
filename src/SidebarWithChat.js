import "./SidebarWithChat.css";
import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarInfo from './SidebarInfo';
import db from './firebase';
import Chat from "./Chat";

function SidebarWithChat() {
    const [{ user }] = useStateValue();
    const [seed, setSeed] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        console.log(user?.uid);
        setSeed(Math.floor(Math.random() * 5000))
    }, []);

    useEffect(() => {
        const unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .collection('friends')        
        .onSnapshot((snapshot) => 
            setFriends(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        );
        return () => {
            unsubscribe();
        }
    }, []);
    
    useEffect(() => {
        if (user?.displayName !== ""){
            setDisplayName(user?.displayName);
        }
        else {
            setDisplayName(user?.email);
        }
    }, []);
    return (
        <div className = "sidebarWithChat">
            <div className = "sidebar__leftSide">
                <div className = "sidebar__header">
                    <div className = "sidebar__headerLeft">
                        <Avatar src = {`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                        <h3>{displayName}</h3>
                    </div>
                    <div className = "sidebar__headerRight">
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </div>
                </div>
                <div className = "sidebar__search">
                    <div className="sidebar__searchContainter">
                        <SearchOutlined />
                        <input placeholder="Search or start new chat" type="text" />
                    </div>

                    <div className = "sidebar__chats">
                        {friends.map(room => (
                            <SidebarInfo 
                                key = {room.id} 
                                id = {room.id}
                                name={room.data.name}/>
                        ))}
                    </div>
                </div>
            </div>
            <Chat />
        </div>
    )
}

export default SidebarWithChat;
