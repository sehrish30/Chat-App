import React, { memo } from 'react';
import ProfileAvatar from '../../ProfileAvatar';
import TimeAgo from 'timeago-react';
import { Button } from 'rsuite';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import PresenceDot from '../../PresenceDot';
import { useCurrentRoom } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';

const MessageItem = ({ message, handleAdmin }) => {
  const { author, createdAt, text } = message;

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

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
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin
                ? 'Remove admin Permission'
                : 'Permit admin in this room'}
            </Button>
          )}
        </ProfileInfoBtnModal>
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

//memo because used context selector
export default memo(MessageItem);
