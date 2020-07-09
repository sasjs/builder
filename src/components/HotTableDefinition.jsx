import React, { useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { Icon, Button, Message } from "semantic-ui-react";
import { produce } from "immer";
import { useReducer } from "react";
import cloneDeep from "lodash.clonedeep";

const mapColumns = (schema, data) => {
  const mappedColumns = data.map((row) => {
    let mappedRow = {};
    row.forEach((cell, index) => {
      const columnName = schema[index].name;
      mappedRow[columnName] = cell;
    });
    return mappedRow;
  });
  return mappedColumns;
};

const TableDefinitionReducer = (state, action) => {
  switch (action.type) {
    case "initialise": {
      return {
        saved: true,
        validationErrors: [],
        data: [...action.columns.map((c) => Object.values(c))],
        tableDefinitionSchema: [
          {
            title: "Name",
            name: "title",
            type: "text",
            width: 200,
          },
          {
            title: "Type",
            name: "type",
            allowInvalid: false,
            type: "dropdown",
            source: ["numeric", "text"],
            width: 200,
            renderer: function (instance, td, row, col, prop, value) {
              if (value === null) {
                td.innerHTML = '<div class="htAutocompleteArrow">▼</div>text';
                instance.setDataAtCell(row, col, "text");
              } else {
                td.innerHTML = `<div class="htAutocompleteArrow">▼</div>${value}`;
              }
            },
          },
          { title: "Label", name: "label", type: "text" },
        ],
      };
    }
    case "setUnsaved": {
      return { ...state, saved: false };
    }
    case "setSaved": {
      return { ...state, saved: false };
    }
    case "addRow": {
      const newData = produce(state.data, (draft) => {
        draft.push([null, "text", null]);
      });
      return {
        ...state,
        saved: false,
        data: [...cloneDeep(newData)],
      };
    }
    case "removeRow": {
      const newData = produce(state.data, (draft) => {
        return draft.filter((_, index) => index !== action.rowIndex);
      });

      return {
        ...state,
        saved: false,
        data: [...newData],
      };
    }
    case "saveData": {
      const column = action.tableInstance.getDataAtCol(0);
      let valid = true;
      let validationErrors = [];
      column.forEach(function (value, row) {
        let data = [...column];
        const index = data.indexOf(value);
        data.splice(index, 1);
        const secondIndex = data.indexOf(value);
        const cell = action.tableInstance.getCellMeta(row, 0);
        if (!value) {
          cell.valid = false;
          const validationError = "Column names are required";
          validationErrors.push(validationError);
          cell.comment = { value: validationError };
          valid = false;
        }
        if (
          index > -1 &&
          secondIndex > -1 &&
          !(value == null || value === "")
        ) {
          cell.valid = false;
          const validationError = (
            <>
              Column names must be unique. Please check column{" "}
              <strong>{value}</strong> at row <strong>{row}</strong>.
            </>
          );
          validationErrors.push(validationError);
          cell.comment = { value: validationError };
          valid = false;
        }
        if (!/^[a-zA-Z_]+[a-zA-Z0-9]*/.test(value) && !!value) {
          cell.valid = false;
          const validationError =
            "Column names must match SAS format - i.e. start with a letter or underscore, and contain only letters, numbers and underscores.";
          validationErrors.push(validationError);
          cell.comment = {
            value: validationError,
          };
          valid = false;
        }
      });
      action.tableInstance.render();
      if (valid) {
        const mappedColumns = mapColumns(
          state.tableDefinitionSchema,
          state.data
        );
        action.callback(mappedColumns);
      }
      return {
        ...state,
        saved: valid,
        validationErrors: Array.from(new Set(validationErrors)),
      };
    }
    default:
      return state;
  }
};

const HotTableDefinition = ({ columns, onUpdate, readOnly, isDarkMode }) => {
  const [state, dispatch] = useReducer(TableDefinitionReducer, {
    data: [],
    tableDefinitionSchema: [],
    saved: true,
    validationErrors: [],
  });
  const tableRef = useRef();

  useEffect(() => {
    dispatch({ type: "initialise", columns });
  }, [columns]);

  return (
    <>
      {!readOnly && (
        <>
          <div className="save-icon">
            <Button
              primary
              onClick={() => {
                dispatch({
                  type: "saveData",
                  callback: onUpdate,
                  tableInstance: tableRef.current.hotInstance,
                });
              }}
            >
              <Icon name="save"></Icon>
              {"  "}Save table definition
            </Button>
            <Button secondary onClick={() => dispatch({ type: "addRow" })}>
              <Icon name="add"></Icon>
              {"  "} Add row
            </Button>
          </div>
          <div className="save-icon" style={{ marginTop: "10px" }}>
            {!state.saved ? (
              <Message info>
                <Message.Content>
                  <Icon name="warning circle" />
                  There are currently unsaved changes in your table definition.
                  <br />
                  Please click 'Save table definition' to save them.
                </Message.Content>
              </Message>
            ) : (
              <Message success visible={true}>
                <Message.Content>
                  <Icon name="check circle" />
                  Your table definition has no unsaved changes.
                </Message.Content>
              </Message>
            )}
          </div>
          <div className="save-icon" style={{ marginTop: "10px" }}>
            {!!state.validationErrors.length && (
              <Message error visible={true}>
                <Message.Content>
                  <Icon name="warning sign" />
                  Please correct the following validation errors:
                  <ul>
                    {state.validationErrors.map((e, index) => (
                      <li key={index}>{e}</li>
                    ))}
                  </ul>
                </Message.Content>
              </Message>
            )}
          </div>
        </>
      )}
      <div
        className={isDarkMode ? "table-container inverted" : "table-container"}
      >
        <HotTable
          licenseKey="non-commercial-and-evaluation"
          ref={tableRef}
          readOnly={readOnly}
          columns={state.tableDefinitionSchema}
          comments={true}
          stretchH="last"
          rowHeaders={true}
          data={state.data}
          beforeChange={(e) => {
            if (!!e) {
              dispatch({ type: "setUnsaved" });
            }
          }}
          contextMenu={{
            items: {
              row_below: {
                name: "Add row",
                callback: () => {
                  setTimeout(() => {
                    dispatch({ type: "addRow" });
                  });
                },
              },
              removeRow: {
                name: "Remove row",
                callback: (_, options) => {
                  setTimeout(() => {
                    const rowIndex = options[0].end.row;
                    dispatch({
                      type: "removeRow",
                      rowIndex,
                    });
                  });
                },
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default React.memo(HotTableDefinition);
