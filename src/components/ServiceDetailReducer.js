import React from "react";
import produce from "immer";
import { toast } from "react-semantic-toasts";

export const ServiceDetailReducer = (state, action) => {
  switch (action.type) {
    case "initialise": {
      const initialState = produce(action.service, (draft) => {
        draft.name = action.service.name;
        draft.description = action.service.description;
        draft.requestTables = action.service.requestTables || [];
        draft.responseTables = action.service.responseTables || [];
        draft.resultTables = [];
        draft.currentRequestTableIndex =
          state.currentRequestTableIndex > -1
            ? state.currentRequestTableIndex
            : draft.requestTables.length - 1;
        draft.currentResponseTableIndex =
          state.currentResponseTableIndex > -1
            ? state.currentResponseTableIndex
            : draft.responseTables.length - 1;
      });
      return initialState;
    }
    case "updateName": {
      if (action.value !== state.name) {
        if (action.validate(action.value)) {
          action.callback({
            name: action.value,
            description: state.description,
            requestTables: state.requestTables,
            responseTables: state.responseTables,
          });
          return {
            ...state,
            name: action.value,
          };
        } else {
          action.event.preventDefault();
          action.event.returnValue = false;
          action.event.target.innerText = state.name;
          toast({
            type: "error",
            icon: "server",
            title: "A service with that name already exists",
            description: `Please try again with a different name`,
            time: 2000,
          });
          return state;
        }
      } else {
        return state;
      }
    }
    case "updateDescription": {
      if (state.description !== action.value) {
        const newState = produce(state, (draft) => {
          draft.description = action.value;
        });
        action.callback({
          name: state.name,
          description: newState.description,
          requestTables: state.requestTables,
          responseTables: state.responseTables,
        });
        return newState;
      } else {
        return state;
      }
    }
    case "addRequestTable": {
      const newRequestTables = produce(state.requestTables, (draft) => {
        draft.push({
          tableName: `NewRequestTable${draft.length + 1}`,
          columns: [{ title: "column1", type: "text" }],
          data: [[null]],
        });
      });
      const newState = produce(state, (draft) => {
        draft.requestTables = newRequestTables;
        draft.currentRequestTableIndex = newRequestTables.length - 1;
      });
      action.callback({
        name: state.name,
        description: state.description,
        requestTables: newState.requestTables,
        responseTables: state.responseTables,
      });
      return newState;
    }
    case "addResponseTable": {
      const newResponseTables = produce(state.responseTables, (draft) => {
        draft.push({
          tableName: `NewResponseTable${draft.length + 1}`,
          columns: [{ title: "column1", type: "text" }],
          data: [[null]],
        });
      });
      const newState = produce(state, (draft) => {
        draft.responseTables = newResponseTables;
        draft.currentResponseTableIndex = newResponseTables.length - 1;
      });
      action.callback({
        name: state.name,
        description: state.description,
        requestTables: state.requestTables,
        responseTables: newState.responseTables,
      });
      return newState;
    }
    case "renameRequestTable": {
      if (action.value === state.requestTables[action.index].tableName) {
        return state;
      }
      const tableNames = state.requestTables.map((t) => t.tableName);
      if (
        tableNames.includes(action.value) &&
        tableNames.indexOf(action.value) !== action.index
      ) {
        toast({
          type: "error",
          icon: "warning",
          title: "Table already exists",
          description: (
            <>
              A table with the name <b>{action.value}</b> already exists.
              <br />
              Please try again with a different table name.
            </>
          ),
          time: 2000,
        });
        action.event.target.innerText =
          state.requestTables[action.index].tableName;
        action.event.target.focus();
        const timeout = setTimeout(() => {
          document.execCommand("selectAll", false, null);
          clearTimeout(timeout);
        });
        return state;
      } else {
        const newRequestTables = produce(state.requestTables, (draft) => {
          draft[action.index].tableName = action.value;
        });
        const newState = produce(state, (draft) => {
          draft.requestTables = newRequestTables;
        });
        action.callback({
          name: state.name,
          description: state.description,
          requestTables: newState.requestTables,
          responseTables: state.responseTables,
        });
        return newState;
      }
    }
    case "renameResponseTable": {
      if (action.value === state.responseTables[action.index].tableName) {
        return state;
      }
      const tableNames = state.responseTables.map((t) => t.tableName);
      if (
        tableNames.includes(action.value) &&
        tableNames.indexOf(action.value) !== action.index
      ) {
        toast({
          type: "error",
          icon: "warning",
          title: "Table already exists",
          description: (
            <>
              A table with the name <b>{action.value}</b> already exists.
              <br />
              Please try again with a different table name.
            </>
          ),
          time: 2000,
        });
        action.event.target.innerText =
          state.responseTables[action.index].tableName;
        action.event.target.focus();
        const timeout = setTimeout(() => {
          document.execCommand("selectAll", false, null);
          clearTimeout(timeout);
        });
        return state;
      } else {
        const newResponseTables = produce(state.responseTables, (draft) => {
          draft[action.index].tableName = action.value;
        });
        const newState = produce(state, (draft) => {
          draft.responseTables = newResponseTables;
        });
        action.callback({
          name: state.name,
          description: state.description,
          requestTables: state.requestTables,
          responseTables: newState.responseTables,
        });
        return newState;
      }
    }

    case "removeRequestTable": {
      const newRequestTables = produce(state.requestTables, (draft) => {
        return draft.filter((_, index) => index !== action.index);
      });

      const newState = produce(state, (draft) => {
        draft.requestTables = newRequestTables;
        draft.currentRequestTableIndex = newRequestTables.length ? 0 : -1;
      });

      toast({
        type: "info",
        icon: "trash alternate outline",
        title: "Table Removed",
        description: `Table ${
          state.requestTables[action.index].tableName
        } has now been removed.`,
        time: 2000,
      });
      action.callback({
        name: state.name,
        description: state.description,
        requestTables: newState.requestTables,
        responseTables: state.responseTables,
      });
      return newState;
    }

    case "removeResponseTable": {
      const newResponseTables = produce(state.responseTables, (draft) => {
        return draft.filter((_, index) => index !== action.index);
      });

      const newState = produce(state, (draft) => {
        draft.responseTables = newResponseTables;
        draft.currentResponseTableIndex = newResponseTables.length ? 0 : -1;
      });

      toast({
        type: "info",
        icon: "trash alternate outline",
        title: "Table Removed",
        description: `Table ${
          state.responseTables[action.index].tableName
        } has now been removed.`,
        time: 2000,
      });
      action.callback({
        name: state.name,
        description: state.description,
        requestTables: state.requestTables,
        responseTables: newState.responseTables,
      });
      return newState;
    }

    case "updateRequestTable": {
      const newRequestTables = produce(state.requestTables, (draft) => {
        draft[action.index] = action.updatedTable;
      });
      const newState = produce(state, (draft) => {
        draft.requestTables = newRequestTables;
      });
      action.callback({
        name: state.name,
        description: state.description,
        requestTables: newState.requestTables,
        responseTables: state.responseTables,
      });
      return newState;
    }

    case "updateResponseTable": {
      const newResponseTables = produce(state.responseTables, (draft) => {
        draft[action.index] = action.updatedTable;
      });
      const newState = produce(state, (draft) => {
        draft.responseTables = newResponseTables;
      });
      action.callback({
        name: state.name,
        description: state.description,
        requestTables: state.requestTables,
        responseTables: newState.responseTables,
      });
      return newState;
    }

    case "setCurrentRequestTable": {
      const newState = produce(state, (draft) => {
        draft.currentRequestTableIndex = action.index;
      });
      return newState;
    }

    case "setCurrentResponseTable": {
      const newState = produce(state, (draft) => {
        draft.currentResponseTableIndex = action.index;
      });
      return newState;
    }

    case "setResultTables": {
      const newState = produce(state, (draft) => {
        draft.resultTables = action.resultTables;
      });
      return newState;
    }

    default: {
      return state;
    }
  }
};
