import React, { useState, useCallback, useRef } from 'react';
import {
  Button,
  Icon,
  Modal,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Schema,
  Alert,
} from 'rsuite';
import firebase from 'firebase/app';
import { useModalState } from '../misc/custom-hooks';
import { database } from '../misc/firebase';

/*-------------------------------------
     Schema comes from Rsuite(validates in realtime)
-------------------------------------*/
const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('Chat name is required'),
  description: StringType().isRequired('Description is required'),
});

const INITIAL_FORM = {
  name: '',
  description: '',
};

const CreateRoomBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  //form value gives us any input of the form
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(); //Refernce to validate against schema

  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    //check will check form current info against schema
    if (!formRef.current.check()) {
      return;
    }

    setIsLoading(true);
    const newRoomdata = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    try {
      await database.ref('rooms').push(newRoomdata);
      Alert.info(`${formValue.name} has been created`, 4000);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-2">
      <Button block color="violet" onClick={open}>
        <Icon icon="creative" />
        Create new chat room
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New Chat Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Room name</ControlLabel>
              <FormControl name="name" placeholder="Enter chat room name" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Type in room description..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create new chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default CreateRoomBtnModal;
