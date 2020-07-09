import React, { useContext, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import "./Services.scss";
import { AppContext } from "../context/AppContext";
import Folder from "../components/Folder";
import ServiceDetail from "../components/ServiceDetail";
import PopupIcon from "../components/PopupIcon";
import { useReducer } from "react";
import { ServicesReducer } from "./ServicesReducer";

const Services = () => {
  const { folders, setFolders, isDarkMode, isDataCleared } = useContext(
    AppContext
  );
  const [state, dispatch] = useReducer(ServicesReducer, {
    folders,
    currentFolderIndex: folders.length - 1,
    currentServiceIndex: folders.length && folders[0].services.length ? 0 : -1,
  });

  useEffect(() => {
    dispatch({ type: "initialise", folders });
  }, [isDataCleared, folders]);

  return (
    <div className="services-container">
      <div className="main-content">
        <Segment raised size="large" className="folders" inverted={isDarkMode}>
          <h3>Folders</h3>
          <PopupIcon
            text="Add folder"
            icon="add"
            color="blue"
            onClick={() => {
              dispatch({ type: "addFolder", callback: setFolders });
            }}
          />
          <div className="folder-list">
            {state.folders.map((folder, index) => {
              return (
                <Folder
                  key={index}
                  folder={folder}
                  selected={state.currentFolderIndex === index}
                  selectedServiceIndex={state.currentServiceIndex}
                  onClick={() => dispatch({ type: "setCurrentFolder", index })}
                  validateServiceName={(name) => {
                    return (
                      !state.folders[state.currentFolderIndex].services
                        .map((s) => s.name)
                        .includes(name) ||
                      name ===
                        state.folders[state.currentFolderIndex].services[
                          state.currentServiceIndex
                        ].name
                    );
                  }}
                  onFolderRename={(newFolderName) => {
                    dispatch({
                      type: "renameFolder",
                      index,
                      name: newFolderName,
                      callback: setFolders,
                    });
                  }}
                  onServiceClick={(serviceIndex) => {
                    dispatch({ type: "setCurrentFolder", index });
                    dispatch({
                      type: "setCurrentService",
                      index: serviceIndex,
                    });
                  }}
                  onAddService={() => {
                    dispatch({
                      type: "addServiceToFolder",
                      index,
                      callback: setFolders,
                    });
                  }}
                  onRemoveService={(serviceIndex) =>
                    dispatch({
                      type: "removeService",
                      index: serviceIndex,
                      callback: setFolders,
                    })
                  }
                  onDelete={() => {
                    dispatch({
                      type: "removeFolder",
                      index,
                      callback: setFolders,
                    });
                  }}
                  onRenameService={(updatedService) => {
                    dispatch({
                      type: "updateService",
                      updatedService,
                      callback: setFolders,
                    });
                  }}
                />
              );
            })}
            {!state.folders.length && (
              <div className="info-message">
                There are no folders to display. Create one using the + icon
              </div>
            )}
          </div>
        </Segment>
        <Segment raised size="large" className="services" inverted={isDarkMode}>
          {!!state.folders.length &&
            state.currentFolderIndex >= 0 &&
            state.currentServiceIndex >= 0 &&
            !!state.folders[state.currentFolderIndex].services.length &&
            !!state.folders[state.currentFolderIndex].services[
              state.currentServiceIndex
            ] && (
              <ServiceDetail
                isDarkMode={isDarkMode}
                service={
                  state.folders[state.currentFolderIndex].services[
                    state.currentServiceIndex
                  ]
                }
                validateServiceName={(name) => {
                  return (
                    !state.folders[state.currentFolderIndex].services
                      .map((s) => s.name)
                      .includes(name) ||
                    name ===
                      state.folders[state.currentFolderIndex].services[
                        state.currentServiceIndex
                      ].name
                  );
                }}
                path={state.folders[state.currentFolderIndex].name}
                onUpdate={(updatedService) => {
                  dispatch({
                    type: "updateService",
                    updatedService,
                    callback: setFolders,
                  });
                }}
              />
            )}
          {state.currentServiceIndex < 0 && (
            <div className="info-message">
              There is no service currently selected. Select or create one from
              the sidebar on the left.
            </div>
          )}
        </Segment>
      </div>
    </div>
  );
};

export default Services;
