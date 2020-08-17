import React from 'react';
import ProfileAvatar from '../../ProfileAvatar';
import TimeAgo from 'timeago-react';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import PresenceDot from '../../PresenceDot';

const MessageItem = ({ message }) => {
  const { author, createdAt, text } = message;

  return (
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />

        {/* <span className="ml-2 text-mediumblue">{author.name}</span> */}
        <ProfileInfoBtnModal
          profile={author}
          appearence="link"
          className="p-0 ml-1 text-mediumblue background-black p-3"
        />
        <TimeAgo
          datetime={createdAt}
          className="font-normal ml-2 text-darkblue"
        />
      </div>
      <div>
        <span className="word-break-all text-chat">{text}</span>
      </div>
    </li>
  );
};

export default MessageItem;
