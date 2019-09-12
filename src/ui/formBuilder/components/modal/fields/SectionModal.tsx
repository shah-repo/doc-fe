import React, { useState, useEffect } from "react";
import styles from "../Modal.module.css";

interface SectionModalProps {
  title: string;
  currentConfig?: { title: string };
  handleSubmit: (e: any, config: any) => void;
}

const SectionModal: React.FunctionComponent<SectionModalProps> = ({
  title,
  currentConfig,
  handleSubmit,
}) => {
  const [config, setConfig] = useState({ title: "" });

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
        <h2>Add {title}</h2>
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

export default SectionModal;
