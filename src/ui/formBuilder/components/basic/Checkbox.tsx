import React, { Fragment, useState } from "react";
import styles from "./BasicFields.module.css";

interface CheckBoxProps {
  title: string;
  notes?: string;
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode?: boolean;
}

const CheckBox: React.FunctionComponent<CheckBoxProps> = ({
  title,
  notes,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const defaulteNote = values ? values.text : false;
  const [note, showNote] = useState(defaulteNote);

  const handleCheck = (e: any) => {
    if (e.target.checked) {
      showNote(true);
    } else {
      showNote(false);
    }
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  const setValue = (e: any) => {
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  const input = (
    <input
      name="text"
      type="text"
      className={styles.checkBoxNotes}
      placeholder={notes}
      onChange={setValue}
      defaultValue={values ? values.text : ""}
    />
  );

  const checkBoxField = (
    <div className={styles.checkBox}>
      <label className={styles.checkBoxContainer}>
        {title}
        <input
          name={title}
          type="checkbox"
          onChange={handleCheck}
          defaultChecked={values ? values[title] : null}
        />
        <span className={styles.innerCheck} />
      </label>
      {note && notes && notes.length > 0 ? input : null}
    </div>
  );

  return <Fragment>{checkBoxField}</Fragment>;
};

export default CheckBox;
