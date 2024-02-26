import { useState } from "react";
import classnames from "classnames";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import "./styles/animate-dropzone.css";
import "./styles/dropzone.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function DropZone({
  file,
  setFile,
}: {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const accept = {
    "image/png": [".png"]
  };

  const [isInvalid, setIsInvalid] = useState(false);

  const onDragOver: DropzoneOptions["onDragOver"] = (e) => {
    if (
      !Array.from(e.dataTransfer.items).some((item) =>
        accept.hasOwnProperty(item.type)
      )
    ) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  };

  const onDrop: DropzoneOptions["onDrop"] = (acceptedFiles) => {
    if (acceptedFiles.length !== 0) {
      setFile(acceptedFiles[0]);
    } else {
      setFile(null);
    }
  };

  const { isDragActive, getRootProps, getInputProps, open } = useDropzone({
    maxFiles: 1,
    maxSize: 52428800,
    onDragOver,
    onDrop,
    accept: accept,
  });

  const remove = () => {
    setFile(null);
  };

  return (
    <section className="container">
      <div
        className={classnames([
          `dropzone-container`,
          "custom-wrapper",
          isDragActive ? "drag-active" : "",
          isInvalid ? "invalid" : "",
        ])}
        onClick={open}
        {...getRootProps()}
      >
        <div className="topbottom" />
        <div className="leftright" />
        <div className={"dropzone"}>
          <div className="instruction">
            Drag and drop your pdf, img, text files here (50MB max).
            <div>
              <Button variant="contained" onClick={open}>
                Open file
              </Button>
            </div>
          </div>
        </div>
        <input {...getInputProps()} multiple={false} />
      </div>
      {file != null ? (
        <aside>
          <Typography variant="h6" gutterBottom>
            Selected file
          </Typography>
          <Typography variant="body1" key={file.name} gutterBottom>
            {file.name} - {file.size} bytes
          </Typography>
          <Button variant="contained" onClick={remove}>
            Remove file
          </Button>
        </aside>
      ) : null}
    </section>
  );
}
