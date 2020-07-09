import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Header,
  Form,
  Input,
  Button,
  Checkbox,
  Message,
  Icon,
} from "semantic-ui-react";
import "./EditColumnModal.scss";

const EditColumnModal = ({ columns, columnIndexToEdit, onEdit, onCancel }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isError, setIsError] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);
  return (
    <Modal open={isOpen} size="tiny" className="edit-column-modal">
      <Header icon="edit" content="Edit column" />
      {isError && (
        <Message error>
          <Icon name="warning" />A column with that name already exists. Please
          try again with a different name
        </Message>
      )}
      <Form
        className="new-folder-form"
        onSubmit={(e) => {
          const newColumnName = e.target.elements.columnName.value;
          const columnTitles = columns.map((c) => c.title);
          if (
            columnTitles.includes(newColumnName) &&
            columnTitles.indexOf(newColumnName) !== columnIndexToEdit
          ) {
            setIsError(true);
          } else {
            onEdit({
              title: newColumnName,
              type: e.target.elements.numeric.checked ? "numeric" : "text",
            });
            setIsOpen(false);
          }
        }}
      >
        <Modal.Content>
          <Form.Field>
            <h4>Column Name</h4>
            <Input
              ref={inputRef}
              type="text"
              name="columnName"
              placeholder="Column Name"
              maxLength="32"
              defaultValue={columns[columnIndexToEdit].title}
              pattern="[_a-zA-Z][_a-zA-Z0-9]*"
              required
              autoFocus
            />
          </Form.Field>
          <Form.Field>
            <label>Numeric</label>
            <Checkbox
              name="numeric"
              toggle
              defaultChecked={columns[columnIndexToEdit].type === "numeric"}
            ></Checkbox>
          </Form.Field>
          <div className="naming-conventions">
            Please make sure to follow the SAS naming convention for names:
            <ul>
              <li>Starts with a letter or an underscore.</li>
              <li>Contains only letters, numbers and underscores.</li>
              <li>Has a maximum length of 32.</li>
            </ul>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button type="submit" color="green">
            Save
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              onCancel();
            }}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Form>
    </Modal>
  );
};

export default EditColumnModal;
