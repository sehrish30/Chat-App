import React from 'react';
import { Icon, IconButton, Modal, Button } from 'rsuite';
import { useParams } from 'react-router';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useModalState } from '../../../misc/custom-hooks';
import { database, auth } from '../../../misc/firebase';

const AskFcmBtnModal = () => {
  const { chatId } = useParams();
  // Getting from useCurrentRoom hook
  const isReceivingFcm = useCurrentRoom(v => v.isReceivingFcm); // v is selectot
  const { isOpen, close, open } = useModalState();

  const onCancel = () => {
    database
      .ref(`/rooms/${chatId}/fcmUsers`)
      .child(auth.currentUser.uid)
      .remove();
  };

  const onAccept = () => {
    database
      .ref(`/rooms/${chatId}/fcmUsers`)
      .child(auth.currentUser.uid)
      .set(true);
  };

  return (
    <>
      <IconButton
        icon={<Icon icon="podcast" />}
        color="cyan"
        size="sm"
        circle
        onClick={open}
        appearance={isReceivingFcm ? 'default' : 'ghost'}
      />

      <Modal show={isOpen} onHide={close} size="xs" backdrop="static">
        <Modal.Header className="text-black">
          Notifications Persmission
        </Modal.Header>
        <Modal.Body>
          {isReceivingFcm ? (
            <div className="text-center">
              <Icon className="text-green mb-3" icon="check-circle" size="5x" />
              <h6 className="text-darkblue">
                You are subscribed to broadcast messages sent by admins of this
                room
              </h6>
            </div>
          ) : (
            <div className="text-center">
              <Icon
                className="text-red mb-3"
                icon="question-circle"
                size="5x"
              />
              <h6 className="text-darkblue text-center">
                Do you want to subscibe to messages sent by admins of this room?
              </h6>
            </div>
          )}
          <p className="mt-2 text-center">
            To receive Notifications make sure you allow Notifications in your
            browser
          </p>
          <p className="text-center">
            Permission:{' '}
            {Notification.permission === 'granted' ? (
              <span className="text-green">Granted</span>
            ) : (
              <span className="text-red">Denied</span>
            )}
          </p>
        </Modal.Body>
        <Modal.Footer>
          {isReceivingFcm ? (
            <Button color="red" onClick={onCancel}>
              I changed my mind
            </Button>
          ) : (
            <Button color="green" onClick={onAccept}>
              Yes, I do
            </Button>
          )}
          <Button onClick={close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AskFcmBtnModal;
