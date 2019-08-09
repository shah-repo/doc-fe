import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface MultipleCheckboxModalProps {
  handleSubmit: (e: any, config: any) => void;
  currentConfig?: { options: any };
}

const MultipleCheckboxModal: React.FunctionComponent<
  MultipleCheckboxModalProps
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

  const handleTextAreaChange = (e: any) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value.split("\n") });
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  return (
    <form onSubmit={submitForm}>
      <div className={styles.modalFormContainer}>
        <h2>Add Multiple Checkbox</h2>
        <label>Label</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="title"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.title : null}
        />
        <label>Options</label>
        <textarea
          onChange={handleTextAreaChange}
          name="options"
          placeholder={"Option 1\nOption 2\nOption 3\n[other]"}
          required={true}
          defaultValue={currentConfig ? currentConfig.options.join("\n") : null}
        />
        <span>
          {" "}
          One option per line. Type [other] with brackets to add "other" option
        </span>
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default MultipleCheckboxModal;
