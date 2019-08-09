import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface ApprovalCollectionModalProps {
  handleSubmit: (e: any, config: any) => void;
  currentConfig?: { title: string; links: any };
}

const ApprovalCollectionModal: React.FunctionComponent<
  ApprovalCollectionModalProps
> = ({ handleSubmit, currentConfig }) => {
  const [config, setConfig] = useState({ title: "", links: [] });

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  return (
    <form onSubmit={submitForm}>
      <div className={styles.modalFormContainer}>
        <h2>Approval Collection</h2>
        <label>Label</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="title"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.title : undefined}
        />
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default ApprovalCollectionModal;
