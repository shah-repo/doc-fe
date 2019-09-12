import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface LineFieldModalProps {
  title: string;
  currentConfig?: { title: string; placeholder: string };
  handleSubmit: (e: any, config: any) => void;
}

const LineFieldModal: React.FunctionComponent<LineFieldModalProps> = ({
  title,
  currentConfig,
  handleSubmit,
}) => {
  const [config, setConfig] = useState({ placeholder: "", title: "" });

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
        <h2> {title}</h2>
        <label>Label</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="title"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.title : undefined}
        />
        <label> Placeholder Text</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="placeholder"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.placeholder : undefined}
        />
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default LineFieldModal;
