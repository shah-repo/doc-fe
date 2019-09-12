import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface CheckBoxModalProps {
  currentConfig?: { notes: string; title: string };
  handleSubmit: (e: any, config: any) => void;
}

const CheckBoxModal: React.FunctionComponent<CheckBoxModalProps> = ({
  currentConfig,
  handleSubmit,
}) => {
  const [config, setConfig] = useState({ notes: "", title: "" });

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  const handleInputChange = (e: any) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  return (
    <form onSubmit={submitForm}>
      <div className={styles.modalFormContainer}>
        <h2>{currentConfig ? "Edit" : "Add"} Checkbox</h2>
        <label>Label</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="title"
          placeholder="Enter here"
          required={true}
          defaultValue={config.title}
        />
        <label>Notes</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="notes"
          placeholder="Enter here"
          value={config.notes}
        />
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default CheckBoxModal;
