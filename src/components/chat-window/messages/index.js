import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { database, auth } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';
import { Alert } from 'rsuite';

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

  let alertMsg;
  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null; //null will remove it
            alertMsg = 'Admin permission removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin permission granted';
          }
        }
        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    //Uid of current user
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1; //null will remove it
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Liked';
        }
      }
      return msg;
    });
    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async msgId => {
      if (!window.confirm('Delete this message')) {
        return;
      }
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        //Will store all messages uptill last msg
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.success('Message has been deleted', 4000);
      } catch (err) {
        Alert.error(err.message, 4000);
      }
    },
    [chatId, messages]
  );

  //Unsubscribe from real tim elistener

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li className="text-chat">No messages yet</li>}
      {canShowMessages &&
        messages.map(msg => (
          <MessageItem
            key={msg.uid}
            message={msg}
            handleLike={handleLike}
            handleAdmin={handleAdmin}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
