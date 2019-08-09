import React, { useState, useEffect } from "react";
import styles from "../Modal.module.css";

interface HyperLinkModalProps {
  currentConfig: {};
  handleSubmit: (e: any, config: any) => void;
}

const HyperLinkModal: React.FunctionComponent<HyperLinkModalProps> = ({
  currentConfig,
  handleSubmit,
}) => {
  const [config, setConfig] = useState();

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (
      name === "url" &&
      (value.includes("https://") || value.includes("http://"))
    ) {
      const newUrl = value.replace(/(^\w+:|^)\/\//, "");
      setConfig({ ...config, url: newUrl });
    } else {
      setConfig({ ...config, [name]: value });
    }
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  return (
    <form onSubmit={submitForm}>
      <div className={styles.modalFormContainer}>
        <h2>Hyperlink</h2>
        <label>Label</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="title"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.title : null}
        />
        <label>URL</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="url"
          placeholder="Enter link here"
          required={true}
          defaultValue={config ? config.url : null}
        />
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default HyperLinkModal;
