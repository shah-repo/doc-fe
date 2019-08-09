import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import styles from "./Tasks.module.css";
import { ReactComponent as DocIcon } from "../../formBuilder/icons/icon_doc.svg";
import { ReactComponent as PdfIcon } from "../../formBuilder/icons/icon_pdf.svg";
import { ReactComponent as PngIcon } from "../../formBuilder/icons/icon_png.svg";
import { ReactComponent as TxtIcon } from "../../formBuilder/icons/icon_txt.svg";
import { ReactComponent as UploadIcon } from "../../formBuilder/icons/icon_upload.svg";

interface LocalProps {
  currentUser: string;
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  status: string;
  attachments: [];
  id: any;
}

interface DispatchProps {
  closeTask: any;
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    closeTask: (id: any) => dispatch({ type: "CLOSE_TASK", id }),
  };
};

export type TaskProps = DispatchProps & LocalProps;

const TaskUser: React.FunctionComponent<TaskProps> = ({
  id,
  title,
  description,
  assignee,
  due_date,
  attachments,
  currentUser,
  closeTask,
  status,
}) => {
  const attachmentRef: any = useRef();
  const [currentTask, setTask] = useState({
    title,
    description,
    assignee,
    due_date,
    attachments,
    status,
  });

  const [files, setFiles]: any = useState([]);

  useEffect(() => {
    setTask({ title, description, assignee, due_date, attachments, status });
  }, [title, description, assignee, due_date, attachments, status]);

  const closeTaskHandler = () => {
    closeTask(id);
  };

  const button =
    status !== "closed" ? (
      <button onClick={closeTaskHandler}>Close Task</button>
    ) : (
      <button disabled={true}>Closed</button>
    );

  const addAtachment = () => {
    attachmentRef.current.value = "";
    attachmentRef.current.click();
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

  const singleTaskContainer = (
    <div className={styles.singleTaskContainer + " " + styles.clearBackground}>
      <h3>{currentTask.title}</h3>
      <p> {currentTask.description}</p>
      {currentUser === "mathew" ? (
        <a className={styles.addAtachment} onClick={addAtachment}>
          Add attachment
        </a>
      ) : null}
      <input
        type="file"
        multiple={true}
        ref={attachmentRef}
        style={{ display: "none" }}
        onChange={viewFiles}
      />
      <div className={styles.taskBottomInfo}>
        <span>
          <strong>Assigned to: </strong> {currentTask.assignee}
        </span>
        <span>
          <strong>Due Date: </strong>
          {currentTask.due_date}{" "}
        </span>
        <span>
          <strong>Status: </strong>
          {currentTask.status}
        </span>
      </div>
      {currentUser === "mathew" ? button : null}
    </div>
  );

  return (
    <div className={styles.showTaskContainer}>
      {singleTaskContainer}
      {currentUser === "mathew" ? filesContainer : null}
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(TaskUser);
