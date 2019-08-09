import React, { Fragment, useState, useEffect } from "react";
import styles from "./BasicFields.module.css";

interface MultiplePackagingProps {
  title: string;
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode: boolean;
}

const MultiplePackaging: React.FunctionComponent<MultiplePackagingProps> = ({
  title,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const defaultPackages = values ? values.packagings : [];
  const [packagings, setPackagings]: any[] = useState(defaultPackages);
  const [packaging, setPackaging] = useState();
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (!editMode) updateValue(currentIndex, "packagings", packagings);
  }, [packagings]);

  const removePackage = (e: any) => {
    const newPackages = [...packagings];
    newPackages.splice(Number(e.target.dataset.id), 1);

    setPackagings([...newPackages]);
  };

  const toggleShowInput = (e: any) => {
    setShowInput(!showInput);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPackaging({ ...packaging, [name]: value });
  };

  const addPackaging = () => {
    setPackagings([...packagings, packaging]);
    setShowInput(false);
  };

  const packagingInput = (
    <div className={styles.inputContainer}>
      <p>
        ([unit 1 value] [unit 1 name] is equal to [unit 2 value] [ unit 2 name])
      </p>{" "}
      <input
        className={styles.halfInput}
        type="text"
        name="firstUnitValue"
        placeholder="Enter Unit 1 value"
        onChange={handleChange}
      />
      <input
        className={styles.halfInput}
        type="text"
        name="firstUnit"
        placeholder="Enter Unit 1"
        onChange={handleChange}
      />
      <input
        className={styles.halfInput}
        type="text"
        name="secondUnitValue"
        placeholder="Enter Unit value"
        onChange={handleChange}
      />
      <input
        className={styles.halfInput}
        type="text"
        name="secondUnit"
        placeholder="Enter Unit 2"
        onChange={handleChange}
      />
      <button className={styles.buttonDefault} onClick={addPackaging}>
        Save
      </button>
      <button className={styles.buttonDefault} onClick={toggleShowInput}>
        Cancel
      </button>
    </div>
  );

  const packagingList =
    packagings &&
    packagings.map((packaging: any, i: any) => (
      <div key={i} className={styles.package}>
        {`${packaging.firstUnitValue}${packaging.firstUnit} is equal to ${
          packaging.secondUnitValue
        }${packaging.secondUnit}`}
        <span data-id={i} onClick={removePackage}>
          remove
        </span>
      </div>
    ));

  const addPackagingSpan = (
    <span className={styles.addPackaging} onClick={toggleShowInput}>
      + Add Packaging
    </span>
  );

  const viewMode = (
    <Fragment>
      <div className={styles.linksContainer}>{packagingList}</div>
      {showInput ? packagingInput : null}
      {!showInput ? addPackagingSpan : null}
    </Fragment>
  );

  const editModeDiv = (
    <span>This will display the ability to add packaging type</span>
  );

  const currentDiv = editMode ? editModeDiv : viewMode;

  return (
    <div className={styles.MultiplePackagingContainer}>
      <h3>{title}</h3>
      {currentDiv}
    </div>
  );
};

export default MultiplePackaging;
