import React, { useState, useEffect } from "react";
import Highlight from "react-highlight.js";
import { toast } from "react-semantic-toasts";
import "./CodeSnippet.scss";
import { Header } from "semantic-ui-react";
import PopupIcon from "./PopupIcon";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { transformToObject } from "../utils";

const CodeSnippet = ({
  path,
  serviceName,
  requestTables,
  responseTables,
  isDarkMode,
}) => {
  const [snippet, setSnippet] = useState("");
  const { config } = useContext(AppContext);
  const { sasJsConfig } = config;

  useEffect(() => {
    const config = {
      appLoc: sasJsConfig.appLoc,
      serverUrl: sasJsConfig.serverUrl,
      serverType: sasJsConfig.serverType,
    };
    let codeSnippet = `const sasJs = new SASjs(${JSON.stringify(
      config,
      null,
      1
    ).replace(
      /"([^(")"]+)":/g,
      "$1:"
    )});\n\nsasJs.request("${path}/${serviceName}"`;
    const mappedTables = requestTables.map((r) => r.data);
    const inputTables = mappedTables.length
      ? transformToObject(mappedTables)
      : {};
    if (Object.keys(inputTables).length) {
      codeSnippet += `,\n${JSON.stringify(inputTables, null, 1)})`;
    } else {
      codeSnippet += ")";
    }

    codeSnippet += "\n.then(";

    if (responseTables.length) {
      const responseTablesObject = {};
      responseTables.forEach((table) => {
        const data = {};
        table.columns.forEach((column) => {
          data[column.title] = column.type === "numeric" ? 123 : "foo";
        });
        responseTablesObject[table.tableName] = [data];
      });
      codeSnippet += `res => {\n    console.log(res);\n/* Response Format\n${JSON.stringify(
        responseTablesObject,
        null,
        1
      )}\n*/\n});`;
    } else {
      codeSnippet += "() => {\n    /* Your logic here */\n}";
    }

    setSnippet(codeSnippet);
  }, [path, requestTables, responseTables, serviceName, sasJsConfig]);

  return (
    <div className="code-snippet-container">
      <div className="tables-header">
        <Header as="h3" inverted={isDarkMode}>
          <code>SASjs </code> Code Snippet
        </Header>
        <PopupIcon
          text="Copy snippet"
          color="blue"
          icon="copy outline"
          onClick={() => {
            navigator.clipboard.writeText(snippet).then(() => {
              toast({
                type: "success",
                icon: "copy outline",
                title: "Code snippet copied",
                description:
                  "Paste into your text editor and get started with SASjs!",
                time: 2000,
              });
            });
          }}
        ></PopupIcon>
      </div>
      <Highlight language="javascript" className="code-snippet">
        {snippet}
      </Highlight>
    </div>
  );
};

export default CodeSnippet;
