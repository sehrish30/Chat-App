import React, { memo } from 'react';
import TimeAgo from 'timeago-react';
import { Button } from 'rsuite';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import ProfileAvatar from '../../ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import { useCurrentRoom } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import IconBtnControl from './IconBtnControl';
import ImgBtnModal from './ImgBtnModal';

const renderFileMessage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }

  if (file.contentType.includes('audio')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your browser doesnot support audio.
      </audio>
    );
  }

  return (
    <a className="text-link" href={file.url}>
      Download{file.name}
    </a>
  );
};

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likeCount, file } = message;

  const [selfRef, isHover] = useHover();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHover;

  //Message liked by signed in user
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHover ? 'bg-blue' : ''}`}
      ref={selfRef}
    >
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
        <IconBtnControl
          {...(isLiked ? { color: 'red' } : { color: 'purple' })}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Like this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName="trash2"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id, file)}
          />
        )}
      </div>

      <div>
        {text && (
          <span className="word-break-all text-chat p-chat">{text}</span>
        )}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

//memo because used context selector
export default memo(MessageItem);
