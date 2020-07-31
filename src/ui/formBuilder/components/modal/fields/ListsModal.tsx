import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface ListsModalProps {
  currentConfig?: { title: string; options: [] };
  handleSubmit: (e: any, config: any) => void;
}

const ListsModal: React.FunctionComponent<ListsModalProps> = ({
  currentConfig,
  handleSubmit,
}) => {
  const [config, setConfig] = useState({ title: "", options: [] });

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleTextAreaChange = (e: any) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value.split("\n") });
  };

  const submitForm = () => (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  return (
    <div className={styles.modalFormContainer}>
      <h2> Custom List </h2>
      <label>Title</label>
      <input
        type="text"
        onChange={handleInputChange}
        name="title"
        placeholder="Enter here"
        required={true}
        defaultValue={config ? config.title : undefined}
      />
      <label>Options</label>
      <textarea
        onChange={handleTextAreaChange}
        name="options"
        placeholder={"Option 1\nOption 2\nOption 3\n[other]"}
        required={true}
        defaultValue={
          currentConfig ? currentConfig.options.join("\n") : undefined
        }
      />
      <span>
        {" "}
        One option per line. Type [other] with brackets to add &quot;other&quot; option
      </span>
      <button type="button" onClick={submitForm()}>{currentConfig ? "Save" : "Add"}</button>
    </div>
  );
};

export default ListsModal;
