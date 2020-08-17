import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  //Get the modal state
  const { isOpen, close, open } = useModalState();

  const { name, avatar, createdAt } = profile;

  const memberSince = new Date(createdAt).toLocaleDateString();

  const shortName = name.split(' ')[0];
  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title className="ml-2">{shortName} profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            className="width-200 height-200 img-fullsize font-huge"
            src={avatar}
            name={name}
          />
          <h4 className="mt-2 text-darkblue">{name}</h4>
          <p className="text-darkblue">Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
