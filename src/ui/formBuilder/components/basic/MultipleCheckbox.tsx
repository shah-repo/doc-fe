import React, { Fragment, useEffect, useState } from "react";
import styles from "./BasicFields.module.css";

interface MultipleCheckboxProps {
  title: string;
  options: any[];
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode?: boolean;
}

const MultipleCheckbox: React.FunctionComponent<MultipleCheckboxProps> = ({
  title,
  options,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const setChosen = values ? values.other : false;
  const setValues = values ? values[title] : [];
  const [otherChosen, chooseOther] = useState(setChosen);
  const [chosenOptions, setChosenOPtions] = useState(setValues);

  useEffect(() => {
    if (!editMode) {
      updateValue(currentIndex, title, chosenOptions);
    }
  }, [chosenOptions]);

  const chosenHandler = (e: any) => {
    chooseOther(e.target.checked);
    if (e.target.checked) {
      setChosenOPtions([...chosenOptions, e.target.value]);
    }
  };

  const addToChosen = (e: any) => {
    if (e.target.checked) {
      setChosenOPtions([...chosenOptions, e.target.value]);
    }
  };

  const setValue = (e: any) => {
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  const inputOther = (
    <input
      type="text"
      name="other"
      placeholder="Enter choice"
      onChange={setValue}
      defaultValue={values ? values.other : null}
    />
  );

  const checkBoxes = options.map((option, i) => {
    if (option === "[other]") {
      return (
        <Fragment>
          <label key={i} className={styles.checkBoxContainer}>
            {" "}
            Other
            <input
              onChange={chosenHandler}
              type="checkbox"
              name="otherBox"
              value={option}
              defaultChecked={values ? values[title].includes(option) : false}
            />
            <span className={styles.innerCheck} />
          </label>
          {otherChosen ? inputOther : null}
        </Fragment>
      );
    } else {
      return (
        <label key={i} className={styles.checkBoxContainer}>
          {" "}
          {option}
          <input
            name={option}
            type="checkbox"
            value={option}
            onChange={addToChosen}
            defaultChecked={values ? values[title].includes(option) : false}
          />
          <span className={styles.innerCheck} />
        </label>
      );
    }
  });

  return (
    <div className={styles.multipleCheckBoxContainer}>
      <h3 className={styles.checkBoxTitle}>{title}</h3>
      <div className={styles.checkBoxGroup}>{checkBoxes}</div>
    </div>
  );
};

export default MultipleCheckbox;
