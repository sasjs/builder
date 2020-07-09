import produce from "immer";

export const serviceTableReducer = (state, action) => {
  switch (action.type) {
    case "setInitialState":
      return {
        tableName: action.tableName,
        rows: [...action.rows],
        columns: [...action.columns],
      };
    case "updateCell": {
      const nextState = updateCell(state, action);
      action.onUpdate({
        tableName: nextState.tableName,
        columns: nextState.columns,
        rows: nextState.rows,
      });
      return nextState;
    }
    case "updateColumnName": {
      const nextState = updateColumnName(state, action);
      action.onUpdate({
        tableName: nextState.tableName,
        columns: nextState.columns,
        rows: nextState.rows,
      });
      return nextState;
    }
    case "toggleColumnType": {
      const nextState = toggleColumnType(state, action);
      action.onUpdate({
        tableName: nextState.tableName,
        columns: nextState.columns,
        rows: nextState.rows,
      });
      return nextState;
    }
    case "removeRow": {
      const nextState = removeRow(state, action);
      action.onUpdate({
        tableName: nextState.tableName,
        columns: nextState.columns,
        rows: nextState.rows,
      });
      return nextState;
    }
    case "removeColumn": {
      const nextState = removeColumn(state, action);
      action.onUpdate({
        tableName: nextState.tableName,
        columns: nextState.columns,
        rows: nextState.rows,
      });
      return nextState;
    }
    case "addRow": {
      const nextState = addRow(state);
      action.onUpdate({
        tableName: nextState.tableName,
        columns: nextState.columns,
        rows: nextState.rows,
      });
      return nextState;
    }
    case "addColumn": {
      const nextState = addColumn(state);
      action.onUpdate({
        tableName: nextState.tableName,
        columns: nextState.columns,
        rows: nextState.rows,
      });
      return nextState;
    }
    default:
      return state;
  }
};

const updateCell = (state, { value, columnIndex, rowIndex, numeric }) => {
  let newRows = [...state.rows],
    newColumns = [...state.columns];
  if (numeric) {
    if (Number.isNaN(Number(value))) {
      newColumns = produce(state.columns, (draft) => {
        const column = draft[columnIndex];
        column.numeric = false;
      });
      newRows = produce(state.rows, (draft) => {
        draft[rowIndex][state.columns[columnIndex].name] = value;
      });
    } else {
      newRows = produce(state.rows, (draft) => {
        draft[rowIndex][state.columns[columnIndex].name] = Number(value);
      });
    }
  } else {
    newRows = produce(state.rows, (draft) => {
      draft[rowIndex][state.columns[columnIndex].name] = value;
    });
  }

  return { tableName: state.tableName, rows: newRows, columns: newColumns };
};

const updateColumnName = (state, { columnIndex, newColumnName }) => {
  const oldColumnName = state.columns[columnIndex].name;
  const newColumns = produce(state.columns, (draft) => {
    draft[columnIndex].name = newColumnName;
  });
  const newRows = produce(state.rows, (draft) => {
    draft.forEach((row) => {
      const cellValue = row[oldColumnName];
      delete row[oldColumnName];
      row[newColumnName] = cellValue;
    });
  });
  return { tableName: state.tableName, rows: newRows, columns: newColumns };
};

const toggleColumnType = (state, { columnIndex }) => {
  const newColumns = produce(state.columns, (draft) => {
    draft[columnIndex].numeric = !draft[columnIndex].numeric;
  });
  const newRows = produce(state.rows, (draft) => draft);
  return { tableName: state.tableName, rows: newRows, columns: newColumns };
};

const removeRow = (state, { rowIndex }) => {
  const newRows = produce(state.rows, (draft) => {
    return draft.filter((_, i) => i !== rowIndex);
  });
  const newColumns = produce(state.columns, (draft) => draft);

  return { tableName: state.tableName, rows: newRows, columns: newColumns };
};

const removeColumn = (state, { columnIndex }) => {
  const column = state.columns[columnIndex];
  const newColumns = produce(state.columns, (draft) => {
    return draft.filter((_, i) => i !== columnIndex);
  });
  const newRows = produce(state.rows, (draft) => {
    draft.forEach((row) => delete row[column.name]);
  });
  return { tableName: state.tableName, rows: newRows, columns: newColumns };
};

const addColumn = (state) => {
  const newColumnName = `Column${state.columns.length + 1}`;
  const newColumns = produce(state.columns, (draft) => {
    draft.push({ name: newColumnName, numeric: true });
    return draft;
  });

  const newRows = produce(state.rows, (draft) => {
    draft.forEach((row) => (row[newColumnName] = ""));
  });
  return { tableName: state.tableName, rows: newRows, columns: newColumns };
};

const addRow = (state) => {
  const newRows = produce(state.rows, (draft) => {
    const row = {};
    state.columns.forEach((column) => {
      if (column.numeric) {
        row[column.name] = 0;
      } else {
        row[column.name] = "";
      }
    });
    draft.push(row);
  });
  const newColumns = produce(state.columns, (draft) => draft);
  return { tableName: state.tableName, rows: newRows, columns: newColumns };
};
