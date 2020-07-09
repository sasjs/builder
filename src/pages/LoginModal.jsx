import React, { useState, useCallback, useContext } from "react";
import {
  Modal,
  Input,
  Form,
  Header,
  Button,
  Icon,
  Loader,
} from "semantic-ui-react";
import { AppContext } from "../context/AppContext";
import "./LoginModal.scss";

const LoginModal = ({ onLogin, onClose, isDarkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const appContext = useContext(AppContext);

  const logIn = useCallback(() => {
    setIsLoggingIn(true);
    appContext.logIn(username, password).then(() => {
      setIsLoggingIn(false);
      onLogin();
    });
  }, [username, password, appContext, onLogin]);

  return (
    <Modal open={true} size="mini" basic closeOnEscape={true} onClose={onClose}>
      <Header icon="sign-in" content="Sign in" inverted={isDarkMode} />
      <Modal.Content>
        <p>Please sign in with your SAS server credentials.</p>
        <Form onSubmit={logIn} inverted={isDarkMode}>
          <Form.Field>
            <label>Username</label>
            <Input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Button primary type="submit" className="login-button">
              {isLoggingIn ? (
                <Loader active inline inverted size="tiny" />
              ) : (
                <Icon name="rocket" />
              )}
              {isLoggingIn ? "  Signing you in..." : "Sign In"}
            </Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default LoginModal;
