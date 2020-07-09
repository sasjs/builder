import React, { createContext, useState, useEffect } from "react";
import SASjs from "sasjs";
import { useCallback } from "react";

const defaultConfig = {
  appConfig: {
    id: "mySasJsApp",
    name: "MySASjsApp",
    description: "My SASjs App",
  },
  sasJsConfig: {
    serverUrl: "",
    appLoc: "/Public/apps",
    serverType: "SASVIYA",
    debug: false,
  },
};

const defaultFolders = [
  {
    name: "common",
    services: [
      {
        name: "appInit",
        description: "This is my SASjs service description. Click me to edit!",
        requestTables: [
          {
            tableName: "test",
            columns: [
              { title: "Person", type: "text" },
              { title: "Value", type: "numeric" },
            ],
            data: {
              test: [
                { Person: "Krishna", Value: 42 },
                { Person: "Allan", Value: 64 },
              ],
            },
          },
        ],
        responseTables: [],
      },
    ],
  },
];

export const AppContext = createContext({
  masterJson: defaultConfig,
  setMasterJson: (json) => {},
  isLoggedIn: false,
  login: () => Promise.reject(),
  adapter: null,
  isDarkMode: false,
});

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [folders, setFolders] = useState(defaultFolders);
  const [adapter, setAdapter] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDataCleared, setIsDataCleared] = useState(false);

  useEffect(() => {
    const darkModeEnabled = JSON.parse(
      localStorage.getItem("sasJsBuilderDarkMode") || "false"
    );
    setIsDarkMode(darkModeEnabled);
    const storedJson = localStorage.getItem("sasJsBuilderConfig");
    let parsedJson, sasjs;
    if (storedJson) {
      parsedJson = JSON.parse(storedJson);
    }
    if (parsedJson && parsedJson.sasJsConfig) {
      sasjs = new SASjs(parsedJson.sasJsConfig);
    } else {
      sasjs = new SASjs(defaultConfig.sasJsConfig);
    }
    setAdapter(sasjs);
    const config = sasjs.getSasjsConfig();
    if (parsedJson) {
      setConfig({ ...parsedJson, sasJsConfig: config });
    } else {
      setConfig((m) => ({
        ...m,
        sasJsConfig: config,
      }));
    }
    const storedFolders = localStorage.getItem("sasJsBuilderFolders");
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    } else {
      setFolders(defaultFolders);
    }
    sasjs.checkSession().then((response) => setIsLoggedIn(response.isLoggedIn));
  }, []);

  useEffect(() => {
    if (config) {
      if (config.sasJsConfig) {
        setAdapter(new SASjs(config.sasJsConfig));
      }
      localStorage.setItem("sasJsBuilderConfig", JSON.stringify(config));
    }
  }, [config]);

  useEffect(() => {
    localStorage.setItem("sasJsBuilderFolders", JSON.stringify(folders));
  }, [folders]);

  const logIn = useCallback(
    (username, password) => {
      return adapter
        .logIn(username, password)
        .then((res) => setIsLoggedIn(true))
        .catch(() => setIsLoggedIn(false));
    },
    [adapter]
  );

  const logOut = useCallback(() => {
    return adapter.logOut().then((res) => setIsLoggedIn(false));
  }, [adapter]);

  const clearStoredData = useCallback(() => {
    setFolders([]);
    setIsDataCleared(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sasJsBuilderDarkMode", isDarkMode);
    if (isDarkMode) {
      document.querySelector("body").classList.add("dark-mode");
    } else {
      document.querySelector("body").classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        config,
        folders,
        setConfig,
        setFolders,
        adapter,
        isLoggedIn,
        logIn,
        logOut,
        isDarkMode,
        setIsDarkMode,
        clearStoredData,
        isDataCleared,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
