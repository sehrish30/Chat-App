import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    //Real time listener on chat data which is subscriber later always unsubscribe
    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrWithId(snap.val());
        setMessages(data);
      });
    //Cleanup function
    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  //Unsubscribe from real tim elistener

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li className="text-chat">No messages yet</li>}
      {canShowMessages &&
        messages.map(msg => <MessageItem key={msg.uid} message={msg} />)}
    </ul>
  );
};

export default Messages;
