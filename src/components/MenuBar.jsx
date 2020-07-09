import React, { useState, useContext } from "react";
import { Menu, Popup, Header, Checkbox, Button, Icon } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import MenuBarItem from "./MenuBarItem";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import LoginModal from "../pages/LoginModal";
import "./MenuBar.scss";

const MenuBar = () => {
  const location = useLocation();
  const {
    isDarkMode,
    isLoggedIn,
    logOut,
    setIsDarkMode,
    config,
    setConfig,
    clearStoredData,
  } = useContext(AppContext);
  const { sasJsConfig } = config;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <Menu inverted={isDarkMode}>
        <Menu.Item>
          <MenuBarItem
            icon="file"
            link="/import-export"
            text="Import / Export"
            active={location.pathname === "/import-export"}
          />
        </Menu.Item>
        <Menu.Item>
          <MenuBarItem
            icon="settings"
            link="/configuration"
            text="Configuration"
            active={location.pathname === "/configuration"}
          />
        </Menu.Item>
        <Menu.Item>
          <MenuBarItem
            icon="server"
            link="/services"
            text="Services"
            active={location.pathname === "/services"}
          />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Popup
              inverted={isDarkMode}
              position="left center"
              content={
                sasJsConfig && sasJsConfig.debug
                  ? "Switch debug off"
                  : "Switch debug on"
              }
              trigger={
                <Checkbox
                  toggle
                  name="debug"
                  checked={sasJsConfig.debug}
                  onChange={(_, event) => {
                    const newDebugValue = event.checked;
                    setConfig({
                      ...config,
                      sasJsConfig: { ...sasJsConfig, debug: newDebugValue },
                    });
                  }}
                />
              }
            />
          </Menu.Item>
          <Menu.Item>
            <Popup
              inverted={isDarkMode}
              position="left center"
              content="Clear stored data"
              trigger={
                <Header
                  as="h4"
                  onClick={() => {
                    clearStoredData();
                    toast({
                      type: "info",
                      icon: "trash alternate outline",
                      title: "Stored data cleared",
                      description: `All stored folders and services have now been removed.`,
                      time: 2000,
                    });
                  }}
                >
                  <Icon name="trash alternate outline" inverted={isDarkMode} />
                </Header>
              }
            />
          </Menu.Item>
          <Menu.Item>
            <Popup
              inverted={isDarkMode}
              position="left center"
              content={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              trigger={
                <Header as="h1" onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? "🌞" : "🌛"}
                </Header>
              }
            />
          </Menu.Item>
          <Menu.Item>
            <Button
              primary
              basic
              onClick={isLoggedIn ? logOut : () => setIsLoginModalOpen(true)}
            >
              {isLoggedIn ? "Sign out" : "Sign in"}
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {isLoginModalOpen && (
        <LoginModal
          isDarkMode={isDarkMode}
          onLogin={() => setIsLoginModalOpen(false)}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </>
  );
};

export default MenuBar;
