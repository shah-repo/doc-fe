import React, { Fragment, useState, ChangeEvent, MouseEvent } from "react";
import styles from "./BasicFields.module.css";

interface ApprovalCollectionProps {
  title: string;
  closed: boolean;
  editMode: boolean;
}

const ApprovalCollection: React.FunctionComponent<ApprovalCollectionProps> = ({
  title,
  editMode,
  closed,
}) => {
  const [approvalButtons, setApprovalButtons]: any[] = useState([]);
  const [approvalButton, setApprovalButton] = useState("");
  const [showInput, setShowInput] = useState(false);

  const approvalButtonColection =
    approvalButtons &&
    approvalButtons.map((button: string, i: number) => (
      <button> {button} </button>
    ));

  const toggleShowInput = () => setShowInput(!showInput);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApprovalButton(e.target.value);
  };

  const addLink = () => {
    setApprovalButtons([...approvalButtons, approvalButton]);
    setShowInput(false);
  };

  const hyperLinkInput = (
    <Fragment>
      <input type="text" placeholder="Enter Approver" onChange={handleChange} />
      <button onClick={addLink}>Save</button>
      <button onClick={toggleShowInput}>Cancel</button>
    </Fragment>
  );

  const addApprovalButton = (
    <button className={styles.addHyperLink} onClick={toggleShowInput}>
      + Add Approval Button
    </button>
  );

  const viewMode = (
    <Fragment>
      <div className={styles.linksContainer}>{approvalButtonColection}</div>
      {showInput ? hyperLinkInput : null}
      {!showInput ? addApprovalButton : null}
    </Fragment>
  );

  const editModeDiv = (
    <span>This will display the ability to add an approval collection</span>
  );

  const currentDiv = editMode ? editModeDiv : viewMode;

  return (
    <div className={styles.ApprovalCollectionContainer}>
      <h3>{title}</h3>
      {currentDiv}
    </div>
  );
};

export default ApprovalCollection;
