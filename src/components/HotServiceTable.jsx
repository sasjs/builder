import React, { useReducer, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { useRef } from "react";
import "handsontable/dist/handsontable.full.css";
import "./HotServiceTable.scss";
import { produce } from "immer";
import { convertToHotTableFormat, convertToSasJsFormat } from "../utils";
import { Tab, Button, Icon, Message } from "semantic-ui-react";
import HotTableDefinition from "./HotTableDefinition";

const ServiceTableReducer = (state, action) => {
  switch (action.type) {
    case "initialise": {
      const newState = {
        saved: true,
        valid: true,
        tableName: action.tableName,
        data: convertToHotTableFormat({
          columns: action.columns,
          data: action.data,
        }),
        columns: [...action.columns],
      };

      if (!newState.data.length) {
        const emptyRow = newState.columns.map(() => null);
        newState.data.push(emptyRow);
      }

      return newState;
    }
    case "setUnsaved": {
      return { ...state, saved: false };
    }
    case "setSaved": {
      return { ...state, saved: true };
    }
    case "setValidity": {
      return { ...state, valid: action.valid };
    }
    case "updateDefinition": {
      action.callback({
        tableName: state.tableName,
        columns: [...action.columns],
        data: convertToSasJsFormat([
          {
            columns: action.columns,
            data: state.data,
            tableName: state.tableName,
          },
        ]),
      });
      return {
        ...state,
        columns: [...action.columns],
      };
    }
    case "updateData": {
      return {
        ...state,
        data: [...action.data],
      };
    }
    case "addDataRow": {
      const newData = produce(state.data, (draft) => {
        const newRow = [];
        state.columns.forEach(() => newRow.push(null));
        draft.push(newRow);
      });
      return {
        ...state,
        saved: false,
        data: [...newData],
      };
    }
    case "removeDataRow": {
      const newData = produce(state.data, (draft) => {
        return draft.filter((_, index) => index !== action.rowIndex);
      });
      return {
        ...state,
        saved: false,
        data: [...newData],
      };
    }
    default:
      return state;
  }
};

const HotServiceTable = ({ table, onUpdate, isDarkMode, readOnly = false }) => {
  const { columns, data } = table;

  const [state, dispatch] = useReducer(ServiceTableReducer, {
    saved: true,
    data,
    columns,
    tableName: table ? table.tableName : "",
  });
  const tableRef = useRef();

  useEffect(() => {
    dispatch({
      type: "initialise",
      ...table,
    });
  }, [table]);

  return (
    <Tab
      renderActiveOnly={true}
      style={{ width: "100%" }}
      menu={{
        fluid: true,
        secondary: true,
        inverted: isDarkMode,
      }}
      panes={[
        {
          menuItem: "Table Definition",
          render: () => (
            <Tab.Pane inverted={isDarkMode}>
              <HotTableDefinition
                columns={state.columns}
                readOnly={readOnly}
                isDarkMode={isDarkMode}
                onUpdate={(newColumns) => {
                  dispatch({
                    type: "updateDefinition",
                    columns: newColumns,
                    callback: onUpdate,
                  });
                }}
              />
            </Tab.Pane>
          ),
        },
        {
          menuItem: "Table Data",
          render: () => (
            <Tab.Pane inverted={isDarkMode}>
              <>
                <div className="save-icon">
                  <Button
                    primary
                    onClick={() => {
                      tableRef.current.hotInstance.validateCells((valid) => {
                        dispatch({ type: "setValidity", valid });
                        if (valid) {
                          onUpdate({
                            ...state,
                            data: convertToSasJsFormat([
                              {
                                columns: state.columns,
                                data: state.data,
                                tableName: state.tableName,
                              },
                            ]),
                          });
                          dispatch({ type: "setSaved" });
                        }
                      });
                    }}
                  >
                    <Icon name="save"></Icon>
                    {"  "}Save table data
                  </Button>
                  <Button
                    secondary
                    onClick={() =>
                      dispatch({
                        type: "addDataRow",
                      })
                    }
                  >
                    <Icon name="add"></Icon>
                    {"  "} Add row
                  </Button>
                </div>
                <div className="save-icon" style={{ marginTop: "10px" }}>
                  {!state.saved ? (
                    <Message info>
                      <Message.Content>
                        <Icon name="warning circle" />
                        There are currently unsaved changes in your table data.
                        <br />
                        Please click 'Save table data' to save them.
                      </Message.Content>
                    </Message>
                  ) : (
                    <Message success visible={true}>
                      <Message.Content>
                        <Icon name="check circle" />
                        Your table data has no unsaved changes.
                      </Message.Content>
                    </Message>
                  )}
                </div>
                <div className="save-icon" style={{ marginTop: "10px" }}>
                  {!state.valid && (
                    <Message error visible={true}>
                      <Message.Content>
                        <Icon name="warning sign" />
                        Your table data has validation errors.
                        <br />
                        Please check that all values match their data types.
                      </Message.Content>
                    </Message>
                  )}
                </div>
              </>
              <div
                className={
                  isDarkMode ? "table-container inverted" : "table-container"
                }
              >
                <HotTable
                  ref={tableRef}
                  readOnly={readOnly}
                  licenseKey="non-commercial-and-evaluation"
                  data={state.data}
                  autoRowSize={true}
                  autoColumnSize={true}
                  manualColumnResize={true}
                  manualRowResize={true}
                  rowHeaders={true}
                  stretchH="all"
                  columns={state.columns}
                  beforeChange={() => dispatch({ type: "setUnsaved" })}
                  afterChange={() => {
                    if (tableRef.current) {
                      tableRef.current.hotInstance.validateCells((valid) => {
                        dispatch({ type: "setValidity", valid });
                      });
                    }
                  }}
                  contextMenu={{
                    items: {
                      row_below: {
                        name: "Add row",
                        callback: () => {
                          setTimeout(() => {
                            dispatch({
                              type: "addDataRow",
                            });
                          });
                        },
                      },
                      remove_row: {
                        name: "Remove row",
                        callback: (_, options) => {
                          setTimeout(() => {
                            const rowIndex = options[0].end.row;
                            dispatch({
                              type: "removeDataRow",
                              rowIndex,
                            });
                          });
                        },
                      },
                    },
                  }}
                ></HotTable>
              </div>
            </Tab.Pane>
          ),
        },
      ]}
    ></Tab>
  );
};

export default React.memo(HotServiceTable);
