import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Icon, ButtonToolbar } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/custom-hooks';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import SendFcmBtnModal from './SendFcmBtnModal';
import AskFcmBtnModal from './AskFcmBtnModal';

const ChatTop = () => {
  const name = useCurrentRoom(v => v.name);
  const isMobile = useMediaQuery('(max-width: 992px)');
  const isAdmin = useCurrentRoom(v => v.isAdmin);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          />
          <span className="text-chatname">{name}</span>
        </h4>
        <ButtonToolbar className="white-space:no-wrap">
          <AskFcmBtnModal />
          {isAdmin && <EditRoomBtnDrawer />}
        </ButtonToolbar>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        {isAdmin && <SendFcmBtnModal />}
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(ChatTop);
//So becuase of useContextSlector if something changes eg name or dec so suppose if
// description changes name wont change and re render
