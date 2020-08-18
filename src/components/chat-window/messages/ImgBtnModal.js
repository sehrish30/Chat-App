import React from 'react';
import { Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';

const ImgBtnModal = ({ src, fileName }) => {
  const { isOpen, open, close } = useModalState();
  return (
    <>
      <input
        type="image"
        alt="file"
        onClick={open}
        src={src}
        className="mw-100 mh-100 w-auto img-style"
      />
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <img src={src} height="100%" width="100%" alt="img" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a href={src} target="_blank" rel="noopener noreferrer">
            View original
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImgBtnModal;
