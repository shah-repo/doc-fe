import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface ApprovalsModalProps {
  currentConfig: { title: ""; links: [] };
  title: string;
  handleSubmit: (e: any, config: any) => void;
}

const ApprovalsModal: React.FunctionComponent<ApprovalsModalProps> = ({
  currentConfig,
  handleSubmit,
  title,
}) => {
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

  const submitForm = () => (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  return (
    <div className={styles.modalFormContainer}>
      <h2>{title}</h2>
      <label>Label</label>
      <input
        type="text"
        onChange={handleInputChange}
        name="title"
        placeholder="Enter here"
        required={true}
        defaultValue={config ? config.title : undefined}
      />
      <button type="button" onClick={submitForm()}>{currentConfig ? "Save" : "Add"}</button>
    </div>
  );
};

export default ApprovalsModal;
