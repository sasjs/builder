import React from "react";
import { Button } from "semantic-ui-react";

const FileUpload = ({ text, onFileChange }) => {
  return (
    <div className="upload-button-wrapper">
      <Button primary>{text}</Button>
      <input type="file" onChange={onFileChange} />
    </div>
  );
};

export default React.memo(FileUpload);
