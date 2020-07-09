import React, { useState } from "react";
import { Icon, Confirm } from "semantic-ui-react";
import ContentEditable from "./ContentEditable";
import "./Folder.scss";
import PopupIcon from "./PopupIcon";
import { useEffect } from "react";
import { useRef } from "react";

const Folder = (props) => {
  const {
    folder,
    selected,
    onClick,
    onDelete,
    onServiceClick,
    onAddService,
    onRemoveService,
    onFolderRename,
    selectedServiceIndex,
    validateServiceName,
    onRenameService,
  } = props;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(selected);
  const [folderName, setFolderName] = useState(folder.name);
  const folderNameRef = useRef();

  useEffect(() => {
    setIsExpanded(selected);
  }, [selected]);

  useEffect(() => {
    if (folderNameRef.current) {
      folderNameRef.current.focus();
      document.execCommand("selectAll", false, null);
    }
  }, [folderNameRef]);

  return (
    <>
      <div className="folder-container">
        <div
          className={selected ? "folder folder-selected" : "folder"}
          onClick={() => {
            onClick(folder);
          }}
        >
          <Icon name="folder"></Icon>
          <ContentEditable
            className="folder-name"
            html={`${folderName}`}
            innerRef={folderNameRef}
            onBlur={(e) => {
              const value = e.target.innerText;
              if (value !== folderName) {
                setFolderName(value);
                onFolderRename(value);
              }
            }}
          />
        </div>
        <PopupIcon
          text="Delete folder"
          icon="trash alternate outline"
          color="red"
          onClick={() => {
            setShowConfirmDelete(true);
          }}
        />
      </div>
      <div className="folder-services">
        {isExpanded &&
          folder.services.map((service, index) => {
            return (
              <div key={service.name}>
                <div
                  className={
                    selectedServiceIndex === index
                      ? "service active"
                      : "service"
                  }
                  onClick={() => onServiceClick(index)}
                >
                  <ContentEditable
                    className="folder-name"
                    html={`${service.name}`}
                    onBlur={(e) => {
                      const value = e.target.innerText;
                      if (value !== service.name) {
                        if (validateServiceName(value)) {
                          onRenameService({ ...service, name: value });
                        }
                      }
                    }}
                  />
                </div>
                <PopupIcon
                  text="Delete service"
                  icon="trash alternate outline"
                  color="red"
                  onClick={() => onRemoveService(index)}
                />
              </div>
            );
          })}
        <PopupIcon
          icon="add"
          color="blue"
          text="Add service"
          className="add-service-icon"
          onClick={() => onAddService()}
        />
      </div>
      <Confirm
        open={showConfirmDelete}
        header={`Delete Folder ${folder.name}`}
        content="Are you sure you want to delete this folder?"
        confirmButton="Yes"
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() => onDelete(folder)}
      />
    </>
  );
};

export default Folder;
