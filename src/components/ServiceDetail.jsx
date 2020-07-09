import React, { useEffect, useReducer, useRef } from "react";
import { Header, Form, Icon, Tab, Label, Menu } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ServiceDetail.scss";
import CodeSnippet from "./CodeSnippet";
import ContentEditable from "./ContentEditable";
import PopupIcon from "./PopupIcon";
import TryItOut from "./TryItOut";
import HotServiceTable from "./HotServiceTable";
import { ServiceDetailReducer } from "./ServiceDetailReducer";

const notifyUpdate = (serviceObject, onUpdate) => {
  onUpdate(serviceObject);
  toast({
    type: "info",
    icon: "save",
    title: "Service updated",
    description: `Service ${serviceObject.name} has now been updated.`,
    time: 2000,
  });
};

const areEqual = (a, b) => {
  let result = true;
  a.forEach((row) => {
    result =
      result && !!b.find((r) => r.title === row.title && r.type === row.type);
  });

  return result;
};

const ServiceDetail = ({
  service,
  path,
  onUpdate,
  validateServiceName,
  isDarkMode,
}) => {
  const serviceNameRef = useRef();
  const requestTabRef = useRef();
  const responseTabRef = useRef();
  const [state, dispatch] = useReducer(ServiceDetailReducer, {
    name: service ? service.name : "",
    description: service ? service.description : "",
    requestTables: service ? service.requestTables : [],
    responseTables: service ? service.responseTables : [],
    resultTables: [],
    currentRequestTableIndex: service.requestTables
      ? service.requestTables.length - 1
      : -1,
    currentResponseTableIndex: service.responseTables
      ? service.responseTables.length - 1
      : -1,
  });

  useEffect(() => {
    if (service) {
      dispatch({ type: "initialise", service });
    }
  }, [service]);

  useEffect(() => {
    if (serviceNameRef.current) {
      serviceNameRef.current.focus();
      const timeout = setTimeout(() => {
        document.execCommand("selectAll", false, null);
        clearTimeout(timeout);
      });
    }
  }, [serviceNameRef]);

  return service ? (
    <>
      <Header className="service-header" inverted={isDarkMode}>
        <Icon name="server" />
        <div className="fields">
          <ContentEditable
            className="service-name-field"
            html={`${state.name}`}
            innerRef={serviceNameRef}
            onClick={(e) => e.stopPropagation()}
            disabled={false}
            onBlur={(e) => {
              const value = e.target.innerText;
              dispatch({
                type: "updateName",
                event: e,
                validate: validateServiceName,
                value,
                callback: (service) => notifyUpdate(service, onUpdate),
              });
            }}
          />
          <ContentEditable
            className="service-description-field"
            maxLength={255}
            allowSpaces={true}
            html={`${state.description}`}
            onClick={(e) => e.stopPropagation()}
            disabled={false}
            onBlur={(e) => {
              const value = e.target.innerText;
              dispatch({
                type: "updateDescription",
                value,
                callback: (service) => notifyUpdate(service, onUpdate),
              });
            }}
          />
        </div>
      </Header>
      <div className="service-modal-inner-container">
        <Form className="service-form" inverted={isDarkMode}>
          <div className="tables-header">
            <Header as="h3" inverted={isDarkMode}>
              Request Tables
            </Header>
            <PopupIcon
              text="Add request table"
              icon="add circle"
              color="blue"
              onClick={() => {
                dispatch({
                  type: "addRequestTable",
                  callback: (service) => notifyUpdate(service, onUpdate),
                });
              }}
            />
          </div>
          {!!state.requestTables.length && (
            <Tab
              menu={{
                tabular: true,
                fluid: true,
                inverted: isDarkMode,
              }}
              renderActiveOnly={true}
              ref={requestTabRef}
              activeIndex={state.currentRequestTableIndex}
              onTabChange={(_, data) =>
                dispatch({
                  type: "setCurrentRequestTable",
                  index: data.activeIndex,
                })
              }
              panes={state.requestTables.map((table, index) => {
                return {
                  menuItem: (
                    <Menu.Item key={index} className="tables-header">
                      <ContentEditable
                        className="table-name-header h3"
                        html={`${table.tableName}`}
                        disabled={false}
                        onBlur={(e) => {
                          const value = e.target.innerText;
                          dispatch({
                            type: "renameRequestTable",
                            index,
                            value,
                            event: e,
                            callback: (service) =>
                              notifyUpdate(service, onUpdate),
                          });
                        }}
                      />
                      <Icon
                        className="icon-button"
                        name="trash alternate outline"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "removeRequestTable",
                            index,
                            callback: (service) =>
                              notifyUpdate(service, onUpdate),
                          });
                        }}
                      />
                    </Menu.Item>
                  ),
                  render: () => (
                    <Tab.Pane inverted={isDarkMode} key={table.tableName}>
                      <HotServiceTable
                        isDarkMode={isDarkMode}
                        table={table}
                        onUpdate={(updatedTable) => {
                          dispatch({
                            type: "updateRequestTable",
                            updatedTable,
                            index,
                            callback: (service) =>
                              notifyUpdate(service, onUpdate),
                          });
                        }}
                      />
                    </Tab.Pane>
                  ),
                };
              })}
            ></Tab>
          )}
          <div className="tables-header">
            <Header as="h3" inverted={isDarkMode}>
              Response Tables
            </Header>
            <PopupIcon
              text="Add response table"
              icon="add circle"
              color="blue"
              onClick={() => {
                dispatch({
                  type: "addResponseTable",
                  callback: (service) => notifyUpdate(service, onUpdate),
                });
              }}
            />
          </div>
          {!!state.responseTables.length && (
            <Tab
              menu={{
                tabular: true,
                fluid: true,
                inverted: isDarkMode,
              }}
              ref={responseTabRef}
              activeIndex={state.currentResponseTableIndex}
              onTabChange={(_, data) =>
                dispatch({
                  type: "setCurrentResponseTable",
                  index: data.activeIndex,
                })
              }
              panes={state.responseTables.map((table, index) => {
                return {
                  menuItem: (
                    <Menu.Item key={index} className="tables-header">
                      <ContentEditable
                        className="table-name-header h3"
                        html={`${table.tableName}`}
                        disabled={false}
                        onBlur={(e) => {
                          const value = e.target.innerText;
                          dispatch({
                            type: "renameResponseTable",
                            index,
                            value,
                            event: e,
                            callback: (service) =>
                              notifyUpdate(service, onUpdate),
                          });
                        }}
                      />
                      <Icon
                        className="icon-button"
                        name="trash alternate outline"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "removeResponseTable",
                            index,
                            callback: (service) =>
                              notifyUpdate(service, onUpdate),
                          });
                        }}
                      />
                    </Menu.Item>
                  ),
                  render: () => (
                    <Tab.Pane inverted={isDarkMode} key={table.tableName}>
                      <HotServiceTable
                        isDarkMode={isDarkMode}
                        table={table}
                        onUpdate={(updatedTable) => {
                          dispatch({
                            type: "updateResponseTable",
                            updatedTable,
                            index,
                            callback: (service) =>
                              notifyUpdate(service, onUpdate),
                          });
                        }}
                      />
                    </Tab.Pane>
                  ),
                };
              })}
            ></Tab>
          )}
        </Form>
        {!!state.resultTables.length && (
          <>
            <Header as="h3" inverted={isDarkMode}>
              Result Tables
            </Header>
            {state.resultTables.map((table, index) => {
              return (
                <>
                  <Header as="h3">
                    <span style={{ padding: "0 8px 0 0 " }}>
                      {table.tableName}
                    </span>
                    {areEqual(
                      table.columns,
                      state.responseTables[index].columns
                    ) && (
                      <Label color="green">
                        <Icon name="check circle"></Icon>
                        {"   "}Matches expected format
                      </Label>
                    )}
                    {!areEqual(
                      table.columns,
                      state.responseTables[index].columns
                    ) && (
                      <Label color="red">
                        <Icon name="warning circle"></Icon>
                        {"   "}Not in expected format
                      </Label>
                    )}
                  </Header>
                  <HotServiceTable
                    readOnly={true}
                    key={index}
                    isDarkMode={isDarkMode}
                    table={table}
                  />
                </>
              );
            })}
          </>
        )}
        {!!service && (
          <div className="code">
            <CodeSnippet
              isDarkMode={isDarkMode}
              path={path}
              serviceName={service.name}
              requestTables={state.requestTables}
              responseTables={state.responseTables}
            />
            <TryItOut
              isDarkMode={isDarkMode}
              path={path}
              serviceName={service.name}
              requestTables={state.requestTables}
              responseTables={state.responseTables}
              onResult={(resultTables) =>
                dispatch({ type: "setResultTables", resultTables })
              }
            />
          </div>
        )}
      </div>
    </>
  ) : (
    <></>
  );
};

export default React.memo(ServiceDetail);
