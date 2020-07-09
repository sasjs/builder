import React, { useState, useContext, useEffect } from "react";
import { Button, Icon, Header, Loader } from "semantic-ui-react";
import { AppContext } from "../context/AppContext";
import Highlight from "react-highlight.js";
import LoginModal from "../pages/LoginModal";
import { transformToObject } from "../utils";

const TryItOut = ({
  path,
  serviceName,
  requestTables,
  responseTables,
  isDarkMode,
  onResult,
}) => {
  const { adapter, isLoggedIn } = useContext(AppContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const makeRequest = () => {
    setError(null);
    setResponse(null);
    setIsLoading(true);
    const mappedTables = requestTables.map((r) => r.data);
    const inputTables = mappedTables.length
      ? transformToObject(mappedTables)
      : null;
    adapter
      .request(`${path}/${serviceName}`, inputTables)
      .then((res) => {
        setResponse(res);
        console.log(res);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
        console.error(e);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (response) {
      const mappedTables = [];
      responseTables.forEach((table) => {
        const data = response[table.tableName];
        let columns = [];
        if (data.length) {
          const columnNames = Object.keys(data[0]);
          columns = columnNames.map((columnName) => {
            const isNumeric = data.every((x) => !isNaN(x));
            return { title: columnName, type: isNumeric ? "numeric" : "text" };
          });
        }
        mappedTables.push({
          tableName: table.tableName,
          columns,
          data: { [table.tableName]: data },
        });
      });
      onResult(mappedTables);
    }
    // eslint-disable-next-line
  }, [response]);

  return (
    <div className="try-it-out">
      <div className="tables-header">
        <Header as="h3" inverted={isDarkMode}>
          Try it out
        </Header>
      </div>
      {isLoggedIn ? (
        <Button color="green" onClick={makeRequest}>
          {isLoading ? (
            <Loader inline active size="tiny" inverted />
          ) : (
            <Icon name="paper plane outline"></Icon>
          )}
          {isLoading ? "  Loading..." : "Send request"}
        </Button>
      ) : (
        <Button color="blue" onClick={() => setIsLoginModalOpen(true)}>
          <Icon name="sign-in"></Icon>Sign in to send request
        </Button>
      )}
      {isLoginModalOpen && (
        <LoginModal
          isDarkMode={isDarkMode}
          onLogin={() => setIsLoginModalOpen(false)}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
      {(!!response || !!error) && (
        <Highlight
          language="javascript"
          className="code-snippet"
          style={{ marginTop: "10px" }}
        >
          {!!response && JSON.stringify(response, null, 1)}
          {!!error && (
            <span className="error">{JSON.stringify(error, null, 1)}</span>
          )}
        </Highlight>
      )}
    </div>
  );
};

export default TryItOut;
