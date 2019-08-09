import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface MultipleHyperLinkModalProps {
  handleSubmit: (e: any, config: any) => void;
  currentConfig?: { links: any };
}

const MultipleHyperLinkModal: React.FunctionComponent<
  MultipleHyperLinkModalProps
> = ({ handleSubmit, currentConfig }) => {
  const [config, setConfig] = useState();

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
        <h2>Multiple Hyperlink</h2>
        <label>Label</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="title"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.title : null}
        />
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default MultipleHyperLinkModal;
