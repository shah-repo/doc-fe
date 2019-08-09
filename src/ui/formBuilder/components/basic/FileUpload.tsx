import React, { Fragment, useRef, useState } from "react";
import { ReactComponent as DocIcon } from "../../formBuilder/icons/icon_doc.svg";
import { ReactComponent as PdfIcon } from "../../formBuilder/icons/icon_pdf.svg";
import { ReactComponent as PngIcon } from "../../formBuilder/icons/icon_png.svg";
import { ReactComponent as TxtIcon } from "../../formBuilder/icons/icon_txt.svg";
import { ReactComponent as UploadIcon } from "../../formBuilder/icons/icon_upload.svg";
import styles from "./BasicFields.module.css";

interface FileUploadProps {
  title: string;
  editMode: boolean;
  closed: boolean;
}

const FileUpload: React.FunctionComponent<FileUploadProps> = ({
  title,
  editMode,
  closed,
}) => {
  const inputFile: any = useRef();
  const [files, setFiles]: any = useState([]);

  const editModFileUploadField = (
    <div className={styles.singleLine}>
      <label>{title}</label>
      <p> This section is for uploading files </p>
    </div>
  );

  const handleClick = () => {
    inputFile.current.value = "";
    inputFile.current.click();
  };

  const fileImage = (ext: string) => {
    let image;
    switch (ext) {
      case "doc":
      case "docx":
        image = <DocIcon />;
        break;
      case "pdf":
        image = <PdfIcon />;
        break;
      case "png":
        image = <PngIcon />;
        break;
      default:
        image = <TxtIcon />;
        break;
    }

    return image;
  };

  const viewFiles = (e: any) => {
    const uploadedFiles = Object.keys(e.target.files).map(
      (fileIndex, i) => e.target.files[fileIndex],
    );
    const allFiles = [...files, ...uploadedFiles];
    setFiles([...Array.from(new Set(allFiles))]);
  };

  const removeFile = (e: any) => {
    const newFiles = [...files];
    newFiles.splice(Number(e.target.dataset.id), 1);

    setFiles([...newFiles]);
  };

  const fileDivs =
    files &&
    files.map((file: any, i: any) => {
      const image = fileImage(file.name.split(".").slice(-1)[0]);
      return (
        <div key={i} className={styles.fileViewContainer}>
          <div data-id={i} className={styles.removeFile} onClick={removeFile}>
            {" "}
          </div>
          {image} {file.name}
        </div>
      );
    });

  const filesContainer = (
    <div className={styles.filesContainer}>{fileDivs}</div>
  );

  const fileUploadField = (
    <div className={styles.fileUploadContainer}>
      <label>{title}</label>
      <div className={styles.uploadInput} onClick={handleClick}>
        <UploadIcon className={styles.uploadInputSvg} />{" "}
        {files.length > 0 ? "ADD FILES" : "UPLOAD FILES"}
      </div>
      <input
        type="file"
        ref={inputFile}
        style={{ display: "none" }}
        multiple={true}
        onChange={viewFiles}
      />
      {files.length > 0 ? filesContainer : null}
    </div>
  );

  return (
    <Fragment>{editMode ? editModFileUploadField : fileUploadField}</Fragment>
  );
};

export default FileUpload;
