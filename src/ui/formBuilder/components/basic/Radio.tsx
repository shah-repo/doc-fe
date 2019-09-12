import React, { Fragment, useState } from "react";
import styles from "./BasicFields.module.css";

interface RadioProps {
  title: string;
  options: any[];
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode: boolean;
}

const RadioField: React.FunctionComponent<RadioProps> = ({
  title,
  options,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const setChosen = values ? values.other : false;
  const [otherChosen, chooseOther] = useState(setChosen);

  const chosenHandler = (e: any) => {
    chooseOther(true);
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  const removeChosenHandler = (e: any) => {
    chooseOther(false);
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
      updateValue(currentIndex, "other", "");
    }
  };

  const setValue = (e: any) => {
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  const radio = options.map((option, i) => {
    if (option === "[other]") {
      return (
        <Fragment>
          <label key={i}>
            {" "}
            Other
            <input
              onChange={chosenHandler}
              type="radio"
              name={title}
              value={option}
              defaultChecked={values ? option === values[title] : false}
            />
            <span className={styles.customRadio} />
          </label>
          {otherChosen ? (
            <input
              name="other"
              type="text"
              placeholder="Enter choice"
              onChange={setValue}
              defaultValue={values ? values.other : null}
            />
          ) : null}
        </Fragment>
      );
    }
    return (
      <label key={i}>
        {" "}
        {option}
        <input
          type="radio"
          name={title}
          value={option}
          onChange={removeChosenHandler}
          defaultChecked={values ? option === values[title] : false}
        />
        <span className={styles.customRadio} />
      </label>
    );
  });

  return (
    <div className={styles.radioContainer}>
      <h3 className={styles.radioTitle}>{title}</h3>
      <div className={styles.radioGroup}>{radio}</div>
    </div>
  );
};

export default RadioField;
