import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface HyperLinkModalProps {
  currentConfig: { title: string; url: string };
  handleSubmit: (e: any, config: any) => void;
}

const HyperLinkModal: React.FunctionComponent<HyperLinkModalProps> = ({
  currentConfig,
  handleSubmit,
}) => {
  const [config, setConfig] = useState({ title: "", url: "" });

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

  const submitForm = () => (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  return (
    <div className={styles.modalFormContainer}>
      <h2>Hyperlink</h2>
      <label>Label</label>
      <input
        type="text"
        onChange={handleInputChange}
        name="title"
        placeholder="Enter here"
        required={true}
        defaultValue={config ? config.title : undefined}
      />
      <label>URL</label>
      <input
        type="text"
        onChange={handleInputChange}
        name="url"
        placeholder="Enter link here"
        required={true}
        defaultValue={config ? config.url : undefined}
      />
      <button type="button" onClick={submitForm()}>{currentConfig ? "Save" : "Add"}</button>
    </div>
  );
};

export default HyperLinkModal;
