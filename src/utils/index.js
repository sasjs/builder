export const sortByName = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export const clearAllSelections = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

export const convertToSasJsFormat = (tables) => {
  const mappedTables = {};
  tables.forEach((table) => {
    const data = table.data.map((row) => {
      let mappedRow = {};
      if (Array.isArray(row)) {
        table.columns.forEach((column, index) => {
          mappedRow[column.title] = row[index] || null;
        });
      }
      return mappedRow;
    });
    mappedTables[table.tableName] = data;
  });
  return mappedTables;
};

export const convertToHotTableFormat = (table) => {
  const mappedTable = [];
  if (!table.data || !Object.keys(table.data).length) {
    return mappedTable;
  }
  const tableData = table.data[Object.keys(table.data)[0]];
  tableData.forEach((row) => {
    const mappedRow = new Array(table.columns.length);
    if (row) {
      Object.keys(row).forEach((property, index) => {
        const columnIndex = table.columns.findIndex(
          (c) => c.title === property
        );
        mappedRow[columnIndex] = row[property];
      });
      mappedTable.push(mappedRow);
    }
  });
  return mappedTable;
};

export const transformToObject = (array) => {
  const result = {};
  for (let i = 0; i < array.length; i++) {
    result[Object.keys(array[i])[0]] = array[i][Object.keys(array[i])[0]];
  }
  return result;
};

export const isNonEmpty = (row) => {
  return Array.isArray(row) && row.some((cell) => !!cell);
};
