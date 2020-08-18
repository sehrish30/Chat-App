import React, { useState } from 'react';
import { InputGroup, Icon, Modal, Button, Uploader, Alert } from 'rsuite';
import { useParams } from 'react-router';
import { storage } from '../../../misc/firebase';
import { useModalState } from '../../../misc/custom-hooks';

const MAX_FILE_SIZE = 1000 * 1024 * 5; //1000 means 1byte 1024 makes it 1MB *5 =5MB

const AttachmentBtnModal = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, close, open } = useModalState();
  const [fileList, setFilelList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = fileArr => {
    const filtered = fileArr
      .filter(el => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5); //slice upo 5 files
    setFilelList(filtered);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map(f => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
      });

      const uploadSnapshots = await Promise.all(uploadPromises);

      const shapePromises = uploadSnapshots.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });

      const files = await Promise.all(shapePromises);

      await afterUpload(files);

      setIsLoading(false);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message);
    }
  };

  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small className="text-mediumblue">
              {' '}
              *only 5 files less than 5 mb are allowed
            </small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
