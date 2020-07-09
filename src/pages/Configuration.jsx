import React, { useContext, useState } from "react";
import { Header, Segment, Form } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import { AppContext } from "../context/AppContext";
import "./Configuration.scss";
import { useEffect } from "react";
import { useRef } from "react";
import { clearAllSelections } from "../utils";

const Configuration = () => {
  const { config, setConfig, isDarkMode } = useContext(AppContext);
  const [serverType, setServerType] = useState(
    config && config.sasJsConfig ? config.sasJsConfig.serverType : null
  );
  const [appConfig, setAppConfig] = useState({});
  const [sasJsConfig, setSasJsConfig] = useState({});
  const formRef = useRef();

  useEffect(() => {
    setAppConfig(config && config.appConfig ? config.appConfig : {});
    setSasJsConfig(config && config.sasJsConfig ? config.sasJsConfig : {});
    setServerType(
      config && config.sasJsConfig ? config.sasJsConfig.serverType : null
    );
    if (config) {
      toast({
        type: "success",
        icon: "code",
        title: "Configuration updated",
        description: (
          <>
            The configuration has now been saved.
            <br />
            You can export it as JSON from the Import/Export page
          </>
        ),
        time: 2000,
      });
    }
  }, [config]);

  useEffect(() => {
    clearAllSelections();
  }, []);

  return (
    <div className="configuration-container">
      <Form ref={formRef} className="config-form" inverted={isDarkMode}>
        <Segment size="large" raised inverted={isDarkMode}>
          <Header as="h3">App Configuration</Header>
          <Form.Group>
            <Form.Field width={6}>
              <label>ID</label>
              <input
                name="id"
                required
                pattern="[a-zA-Z0-9_]+"
                maxLength="16"
                placeholder="ID"
                defaultValue={appConfig.id}
                onBlur={(e) => {
                  e.target.classList.remove("invalid");
                  e.target.setCustomValidity("");
                  if (e.target.checkValidity()) {
                    setConfig({
                      ...config,
                      appConfig: { ...appConfig, id: e.target.value },
                    });
                  } else {
                    e.target.setCustomValidity(
                      "ID can only contain letters, numbers and underscores."
                    );
                    e.target.classList.add("invalid");
                    e.target.reportValidity();
                  }
                }}
              />
            </Form.Field>
            <Form.Field width={12}>
              <label>Name</label>
              <input
                name="name"
                required
                maxLength="32"
                placeholder="Name"
                defaultValue={appConfig.name}
                onBlur={(e) => {
                  e.target.classList.remove("invalid");
                  e.target.setCustomValidity("");
                  if (e.target.checkValidity()) {
                    setConfig({
                      ...config,
                      appConfig: { ...appConfig, name: e.target.value },
                    });
                  } else {
                    e.target.setCustomValidity(
                      "Name can only contain letters, numbers and underscores."
                    );
                    e.target.classList.add("invalid");
                    e.target.reportValidity();
                  }
                }}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Description</label>
            <input
              name="description"
              placeholder="Description"
              maxLength="128"
              defaultValue={appConfig.description}
              onBlur={(e) => {
                e.target.classList.remove("invalid");
                if (e.target.checkValidity()) {
                  setConfig({
                    ...config,
                    appConfig: { ...appConfig, description: e.target.value },
                  });
                } else {
                  e.target.classList.add("invalid");
                  e.target.reportValidity();
                }
              }}
            />
          </Form.Field>
          <Header as="h3">
            <code>SASjs</code> Configuration
          </Header>
          <Form.Field>
            <label>Server URL</label>
            <input
              name="serverUrl"
              type="url"
              placeholder="Server URL"
              defaultValue={sasJsConfig.serverUrl}
              onBlur={(e) => {
                e.target.setCustomValidity("");
                e.target.classList.remove("invalid");
                if (e.target.checkValidity()) {
                  setConfig({
                    ...config,
                    sasJsConfig: { ...sasJsConfig, serverUrl: e.target.value },
                  });
                } else {
                  e.target.setCustomValidity(
                    "Server URL needs to be a valid URL"
                  );
                  e.target.classList.add("invalid");
                  e.target.reportValidity();
                }
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>App Location</label>
            <input
              name="appLoc"
              required
              pattern="[a-zA-Z0-9_/-.]+"
              placeholder="App Location"
              defaultValue={sasJsConfig.appLoc}
              onBlur={(e) => {
                e.target.classList.remove("invalid");
                e.target.setCustomValidity("");
                if (e.target.checkValidity()) {
                  setConfig({
                    ...config,
                    sasJsConfig: { ...sasJsConfig, appLoc: e.target.value },
                  });
                } else {
                  e.target.setCustomValidity(
                    "App Location can only contain letters, numbers, slashes, dashes and underscores."
                  );
                  e.target.classList.add("invalid");
                  e.target.reportValidity();
                }
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Server Type</label>
            <Form.Select
              name="serverType"
              placeholder="Server type"
              onChange={(_, { value }) => {
                setConfig({
                  ...config,
                  sasJsConfig: { ...sasJsConfig, serverType: value },
                });
              }}
              defaultValue={serverType}
              options={[
                {
                  key: "SAS9",
                  value: "SAS9",
                  text: "SAS9",
                },
                {
                  key: "SASVIYA",
                  value: "SASVIYA",
                  text: "SASVIYA",
                },
              ]}
            />
          </Form.Field>
          <Form.Field>
            <label>SAS9 Path</label>
            <input
              name="pathSAS9"
              required
              pattern="[a-zA-Z0-9_/-]+"
              placeholder="SAS9 Path"
              defaultValue={sasJsConfig.pathSAS9}
              onBlur={(e) => {
                e.target.classList.remove("invalid");
                e.target.setCustomValidity("");
                if (e.target.checkValidity()) {
                  setConfig({
                    ...config,
                    sasJsConfig: { ...sasJsConfig, pathSAS9: e.target.value },
                  });
                } else {
                  e.target.setCustomValidity(
                    "This field can only contain letters, numbers, slashes, dashes and underscores."
                  );
                  e.target.classList.add("invalid");
                  e.target.reportValidity();
                }
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>SAS Viya Path</label>
            <input
              name="pathSASViya"
              required
              pattern="[a-zA-Z0-9_/-]+"
              placeholder="SAS Viya Path"
              defaultValue={sasJsConfig.pathSASViya}
              onBlur={(e) => {
                e.target.classList.remove("invalid");
                e.target.setCustomValidity("");
                if (e.target.checkValidity()) {
                  setConfig({
                    ...config,
                    sasJsConfig: {
                      ...sasJsConfig,
                      pathSASViya: e.target.value,
                    },
                  });
                } else {
                  e.target.setCustomValidity(
                    "This field can only contain letters, numbers, slashes, dashes and underscores."
                  );
                  e.target.classList.add("invalid");
                  e.target.reportValidity();
                }
              }}
            />
          </Form.Field>
        </Segment>
      </Form>
    </div>
  );
};

export default Configuration;
