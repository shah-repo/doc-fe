import React from "react";
import { default as ReactDatePicker } from "react-datepicker";
import { getStartOfDayDateString } from "../../../../common/utils/date";
import styles from "./BasicFields.module.css";

interface DatePickerProps {
  title: string;
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode?: boolean;
}

const DatePicker: React.FunctionComponent<DatePickerProps> = ({
  title,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const handleDayChange = (day: Date) => {
    if (!editMode) {
      updateValue(currentIndex, title, getStartOfDayDateString(day, "L"));
    }
  };

  return (
    <div className={styles.singleLine}>
      <label htmlFor={title}>{title}</label>
      <ReactDatePicker
        name={title}
        onChange={handleDayChange}
        value={values && values[title]}
        selected={values && new Date(`${values[title]}`)}
      />
    </div>
  );
};

export default DatePicker;
