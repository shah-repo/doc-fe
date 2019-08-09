import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";

interface ParagraphModalProps {
  currentConfig?: {};
  handleSubmit: (e: any, config: any) => void;
}

const ParagraphModal: React.FunctionComponent<ParagraphModalProps> = ({
  handleSubmit,
  currentConfig,
}) => {
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
        <h2>Paragraph</h2>
        <textarea
          onChange={handleInputChange}
          name="text"
          placeholder="Enter text here"
          required={true}
          value={config ? config.text : ""}
        />
        <h4 className={styles.subTitle}>Text type</h4>
        <div className={styles.radioContainer}>
          <label>
            {" "}
            Heading
            <input
              type="radio"
              onChange={handleInputChange}
              name="textType"
              value="heading"
              required={true}
              checked={config ? "heading" === config.textType : false}
            />
            <span className={styles.customRadio} />
          </label>
          <label>
            {" "}
            Body
            <input
              type="radio"
              onChange={handleInputChange}
              name="textType"
              value="body"
              required={true}
              checked={config ? "body" === config.textType : false}
            />
            <span className={styles.customRadio} />
          </label>
        </div>
        <button>{currentConfig ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default ParagraphModal;
