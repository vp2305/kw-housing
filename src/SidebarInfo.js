import "./SidebarInfo.css";
import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import db from './firebase';
function SidebarInfo({id, name}) {
    const [seed, setSeed] = useState('');
    const [messages, setMessages] = useState("");
    const [{ user }] = useStateValue();
    const history = useHistory();

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, []);

    useEffect(() => {
        if (id){
            db
            .collection('users')
            .doc(user?.uid)
            .collection('friends')
            .doc(id)
            .collection('messages')
            .orderBy('timestamps', 'desc')
            .onSnapshot((snapshot) =>
                setMessages(snapshot.docs.map((doc) => doc.data()))
            );
        }
    }, [id]);

    const pushToRoom = (e) => {
        //to={`/messages/${id}`}
        history.push('/messages/' + id);
        // console.log("PUSHED BUTTON");
    }
    
    return (
        <a onClick={pushToRoom}>
            <div className="sidebarInfoChat">
                <Avatar src = {`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className = "sidebarChat_container">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </a>
    )
}
export default SidebarInfo;
