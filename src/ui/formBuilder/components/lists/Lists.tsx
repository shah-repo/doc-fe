import React, { Fragment, useEffect, useState } from "react";
import styles from "../basic/BasicFields.module.css";
import { FieldConstants } from "../modal/FieldConstants";

interface ListsProps {
  title: string;
  options?: any;
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex: any;
  editMode: boolean;
}

interface BigObject<T> {
  [index: string]: T;
}

const Lists: React.FunctionComponent<ListsProps> = ({
  title,
  options,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const [choices, setChoices] = useState([]);
  const [stringTitle, setStringTitle] = useState();
  const [other, setOther] = useState(false);
  useEffect(() => {
    if (options) {
      setChoices(options);
    }
  }, [options]);

  const lists: BigObject<string> = FieldConstants.lists;
  useEffect(() => {
    if (Object.keys(lists).includes(title)) {
      setStringTitle(lists[title]);
    } else {
      setStringTitle(title);
    }
  }, [stringTitle]);

  const selectOptions = choices.map((choice: string, i) => (
    <option
      key={i}
      value={choice}
      // tslint:disable-next-line: jsx-alignment
      selected={choice === (values ? values.selected : "")}>
      {choice}
    </option>
  ));

  const handeSelectChange = (e: any) => {
    if (e.target.value === "[other]") {
      setOther(true);
    } else {
      setOther(false);
    }
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  const handleChange = (e: any) => {
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  const otherInput = (
    <input
      type="text"
      placeholder="Please fill in your other option"
      name="other"
      onChange={handleChange}
      defaultValue={values ? values.other : ""}
    />
  );

  const listField = (
    <div className={styles.select}>
      <label htmlFor={stringTitle}>{stringTitle}</label>
      <select
        name="selected"
        onChange={handeSelectChange}
        // tslint:disable-next-line: jsx-alignment
        defaultValue={values ? values.selected : ""}>
        <option>Please select from {stringTitle}</option>
        {selectOptions}
      </select>
      {other ? otherInput : null}
    </div>
  );

  return <Fragment>{listField}</Fragment>;
};

export default Lists;
