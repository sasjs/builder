import React, { useContext } from "react";
import { Button } from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import "./ImportExport.scss";
import FileUpload from "../components/FileUpload";
import { AppContext } from "../context/AppContext";

const ImportExport = (props) => {
  const { setConfig, setFolders, config, folders } = useContext(AppContext);

  const importJson = (jsonObject) => {
    const { config, folders } = jsonObject;
    setConfig(config);
    setFolders(folders);
    toast({
      type: "success",
      icon: "file",
      title: "File imported successfully",
      description: `Your configuration and services have now been loaded.`,
      time: 2000,
    });
    props.history.push("/configuration");
  };

  const exportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ config, folders }, null, 2));
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute("download", "sasServices.json");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    toast({
      type: "success",
      icon: "file",
      title: "Success!",
      description: `Your JSON file has now been downloaded.`,
      time: 2000,
    });
  };

  const onFileChanged = (event) => {
    let file = event.target.files[0];
    if (!file) {
      return;
    }

    let reader = new FileReader();
    reader.onload = (() => {
      return function (e) {
        let json = null;
        try {
          json = JSON.parse(e.target.result);
        } catch (e) {
          toast({
            type: "error",
            icon: "file",
            title: "Oops! There was an error parsing your JSON file.",
            description: `Your JSON file could not be parsed. Please check the file and try again`,
            time: 2000,
          });
        }
        if (json) {
          importJson(json);
        }
      };
    })();
    reader.readAsText(file);
  };
  return (
    <div className="import-export-container">
      <div className="file-upload">
        <FileUpload text="Upload JSON file" onFileChange={onFileChanged} />
        {!!config && !!folders && (
          <Button color="green" onClick={exportJson}>
            Export JSON
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportExport;
