import produce from "immer";
import { toast } from "react-semantic-toasts";

export const ServicesReducer = (state, action) => {
  switch (action.type) {
    case "initialise": {
      const newFolders = produce(action.folders, (draft) => draft);
      return {
        ...state,
        folders: newFolders,
      };
    }
    case "addFolder": {
      const newFolderName = `newFolder${state.folders.length + 1}`;
      const newFolder = { name: newFolderName, services: [] };
      const newFolders = produce(state.folders, (draft) => {
        draft.push(newFolder);
      });
      action.callback(newFolders);
      return {
        folders: newFolders,
        currentFolderIndex: state.folders.length,
        currentServiceIndex: -1,
      };
    }
    case "removeFolder": {
      const newFolders = produce(state.folders, (draft) => {
        return draft.filter((_, index) => index !== action.index);
      });
      action.callback(newFolders);
      return {
        folders: newFolders,
        currentFolderIndex: state.folders.length - 1,
        currentServiceIndex: -1,
      };
    }
    case "renameFolder": {
      const folderExists = state.folders.some((f) => f.name === action.name);
      if (folderExists) {
        toast({
          type: "error",
          icon: "folder",
          title: "A folder with that name already exists",
          description: `Please try again with a different name`,
          time: 2000,
        });
        return state;
      }
      const newFolders = produce(state.folders, (draft) => {
        draft[action.index].name = action.name;
      });
      action.callback(newFolders);
      return {
        folders: newFolders,
        currentFolderIndex: action.index,
        currentServiceIndex: state.currentServiceIndex,
      };
    }
    case "setCurrentFolder": {
      return {
        ...state,
        currentFolderIndex: action.index,
      };
    }
    case "setCurrentService": {
      return {
        ...state,
        currentServiceIndex: action.index,
      };
    }
    case "addServiceToFolder": {
      const service = {
        name: `myService${
          state.folders[action.index].services
            ? state.folders[action.index].services.length + 1
            : 1
        }`,
        description: "This is my SASjs service description. Click me to edit!",
        requestTables: [],
        responseTables: [],
      };
      const newFolders = produce(state.folders, (draft) => {
        draft[action.index].services.push(service);
      });
      action.callback(newFolders);
      return {
        folders: newFolders,
        currentFolderIndex: state.currentFolderIndex,
        currentServiceIndex: state.folders[action.index].services.length,
      };
    }

    case "removeService": {
      const newFolders = produce(state.folders, (draft) => {
        draft[state.currentFolderIndex].services = draft[
          state.currentFolderIndex
        ].services.filter((_, index) => index !== action.index);
      });
      action.callback(newFolders);
      return {
        folders: newFolders,
        currentFolderIndex: state.currentFolderIndex,
        currentServiceIndex: state.currentServiceIndex - 1,
      };
    }
    case "updateService": {
      const updatedFolder = produce(
        state.folders[state.currentFolderIndex],
        (draft) => {
          if (state.currentServiceIndex >= 0) {
            draft.services[state.currentServiceIndex] = action.updatedService;
          } else {
            draft.services.push(action.updatedService);
          }
          return draft;
        }
      );
      const updatedFolders = produce(state.folders, (draft) => {
        draft[state.currentFolderIndex] = updatedFolder;
      });
      action.callback(updatedFolders);
      return {
        ...state,
        folders: updatedFolders,
      };
    }
    default:
      return state;
  }
};
