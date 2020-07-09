import React, { useEffect } from "react";
import ContentEditable from "./ContentEditable";
import { Table, Icon, Label, Popup } from "semantic-ui-react";
import "./ServiceTable.scss";
import PopupIcon from "./PopupIcon";
import { useReducer } from "react";
import { serviceTableReducer } from "./ServiceTableReducer";

const ServiceTable = ({ table, onUpdate, isDarkMode }) => {
  const [state, dispatch] = useReducer(serviceTableReducer, {
    tableName: "",
    data: {},
    columns: [],
  });

  useEffect(() => {
    if (table) {
      dispatch({
        type: "setInitialState",
        tableName: table.tableName,
        data: table.data,
        columns: table.columns,
      });
    }
  }, [table]);

  return (
    <div className="service-table-container">
      <div className="table-inner-container">
        <Table celled inverted={isDarkMode}>
          <Table.Header>
            <Table.Row>
              {state.columns.map((column, index) => {
                return (
                  <Table.HeaderCell key={index}>
                    <div className="service-header-cell">
                      <ContentEditable
                        className="full-width editable-cell"
                        html={`${column.name}`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={false}
                        onBlur={(e) => {
                          const newColumnName = e.target.innerText;
                          dispatch({
                            type: "updateColumnName",
                            columnIndex: index,
                            newColumnName,
                            onUpdate,
                          });
                        }}
                      />
                      <div>
                        <Label circular color="teal" size="mini">
                          <Popup
                            inverted
                            content={
                              column.numeric
                                ? "Change to non-numeric"
                                : "Change to numeric"
                            }
                            trigger={
                              <img
                                className="type-label"
                                src={column.numeric ? "123.png" : "abc.png"}
                                alt="type"
                                onClick={() => {
                                  dispatch({
                                    type: "toggleColumnType",
                                    columnIndex: index,
                                    onUpdate,
                                  });
                                }}
                              />
                            }
                          />
                        </Label>
                        <PopupIcon
                          text="Remove column"
                          icon="trash alternate outline"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch({
                              type: "removeColumn",
                              columnIndex: index,
                              onUpdate,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Table.HeaderCell>
                );
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {state.rows.map((row, rowIndex) => {
              return (
                <>
                  <Table.Row key={rowIndex}>
                    {state.columns.map((column, columnIndex) => {
                      return (
                        <Table.Cell key={`${column.name}${rowIndex}`}>
                          <ContentEditable
                            className="editable=cell"
                            html={`${row[column.name]}`}
                            onClick={(e) => e.stopPropagation()}
                            disabled={false}
                            onBlur={(e) => {
                              const value = e.target.innerText;

                              dispatch({
                                type: "updateCell",
                                rowIndex,
                                columnIndex,
                                value,
                                numeric: column.numeric,
                                onUpdate,
                              });
                            }}
                          />
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                  <Icon
                    name="trash alternate outline"
                    color="red"
                    className="icon-button"
                    onClick={() =>
                      dispatch({ type: "removeRow", rowIndex, onUpdate })
                    }
                  />
                </>
              );
            })}
          </Table.Body>
        </Table>
        <PopupIcon
          text="Add column"
          icon="add circle"
          color="blue"
          onClick={() => dispatch({ type: "addColumn", onUpdate })}
        />
      </div>
      <PopupIcon
        text="Add row"
        icon="add circle"
        color="blue"
        onClick={() => dispatch({ type: "addRow", onUpdate })}
      />
    </div>
  );
};

export default ServiceTable;
