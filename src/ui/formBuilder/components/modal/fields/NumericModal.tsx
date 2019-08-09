import React, { useState, useEffect } from "react";
import styles from "../Modal.module.css";

interface NumericModalProps {
  currentConfig?: { tolerance: boolean };
  title: string;
  handleSubmit: (e: any, config: any) => void;
}

const NumericModal: React.FunctionComponent<NumericModalProps> = ({
  currentConfig,
  title,
  handleSubmit,
}) => {
  const [config, setConfig] = useState();
  const [withTolerance, setTolerance] = useState(false);

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
      setTolerance(currentConfig.tolerance);
    }
  }, [currentConfig]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const toleranceCheck = (e: any) => {
    const { name, checked } = e.target;
    setConfig({ ...config, [name]: checked });
    setTolerance(checked);
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    handleSubmit(e, config);
  };

  const tolerance = (
    <div className={styles.toleranceContainer}>
      <div className={styles.radioContainer}>
        <label>
          {" "}
          Percent
          <input
            type="radio"
            onChange={handleInputChange}
            name="toleranceType"
            value="percent"
            required={withTolerance}
            checked={config ? "percent" === config.toleranceType : false}
          />
          <span className={styles.customRadio} />
        </label>
        <label>
          {" "}
          Number
          <input
            type="radio"
            onChange={handleInputChange}
            name="toleranceType"
            value="number"
            required={withTolerance}
            checked={config ? "number" === config.toleranceType : false}
          />
          <span className={styles.customRadio} />
        </label>
      </div>
      <input
        onChange={handleInputChange}
        type="text"
        name="min"
        placeholder="Enter minimum value placeholder"
        required={withTolerance}
        defaultValue={config ? config.min : null}
      />
      <input
        onChange={handleInputChange}
        type="text"
        name="max"
        placeholder="Enter maximum value palceholder"
        required={withTolerance}
        defaultValue={config ? config.max : null}
      />
    </div>
  );

  return (
    <form onSubmit={submitForm}>
      <div className={styles.modalFormContainer}>
        <h2>
          {currentConfig ? "Edit" : "Add"} {title}
        </h2>
        <label>Label</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="title"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.title : null}
        />
        <label>Placeholder</label>
        <input
          type="text"
          onChange={handleInputChange}
          name="placeholder"
          placeholder="Enter here"
          required={true}
          defaultValue={config ? config.placeholder : null}
        />
        <input
          type="checkbox"
          onChange={toleranceCheck}
          name="tolerance"
          checked={config ? config.tolerance : null}
        />{" "}
        with tolerance? {withTolerance ? tolerance : null}
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default NumericModal;
