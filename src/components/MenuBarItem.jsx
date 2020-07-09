import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Label } from "semantic-ui-react";
import "./MenuBarItem.scss";

const MenuBarItem = ({ icon, link, text, showLabel, active }) => {
  return (
    <Link to={link}>
      <Menu.Item
        as="span"
        className={active ? "menu-bar-item active" : "menu-bar-item"}
      >
        <Icon name={icon} />
        {text}
        {showLabel && (
          <Label color="teal" floating>
            New!
          </Label>
        )}
      </Menu.Item>
    </Link>
  );
};

export default React.memo(MenuBarItem);
