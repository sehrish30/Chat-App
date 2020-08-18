import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { database, auth, storage } from '../../../misc/firebase';
import { transformToArrWithId, groupBy } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');

// Scroll to the bottom if we hit threshold
function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0; // % of page scrolled
  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      messagesRef.off();
      // Real time listener on chat data which is subscriber later always unsubscribe
      messagesRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = transformToArrWithId(snap.val());
          setMessages(data);

          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });
      setLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight; // to findout screen height

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight; // to retain scroll position
    }, 200);
  }, [loadMessages, limit]);

  useEffect(() => {
    // To get actual refernce to our element
    const node = selfRef.current;
    loadMessages();
    // node is synchronous and loadMEssages asynchronous
    // it might get uploaded before messages so make it async
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 200);

    // Cleanup function
    return () => {
      messagesRef.off('value');
    };
  }, [loadMessages]);

  let alertMsg;
  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null; // null will remove it
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
    // Uid of current user
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1; // null will remove it
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
    async (msgId, file) => {
      if (!window.confirm('Delete this message')) {
        return;
      }
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        // Will store all messages uptill last msg
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
        // eslint-disable-next-line consistent-return
        return Alert.error(err.message, 4000);
        // This make sure if first delete fails file delete shouldnt execute
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
          Alert.success('File deleted', 4000);
        } catch (err) {
          Alert.error(err.message);
        }
      }
    },
    [chatId, messages]
  );

  //Unsubscribe from real tim elistener
  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];
    //look at every date inside grp object and pushes keys into item array
    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded text-gray">
          {date}
        </li>
      );
      //mapping through every message
      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.uid}
          message={msg}
          handleLike={handleLike}
          handleAdmin={handleAdmin}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs); // spread operator spreads like[1, 2,3]
    });
    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="blue" appearance="ghost">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li className="text-chat">No messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
