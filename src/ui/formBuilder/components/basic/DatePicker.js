import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate, parseDate } from "react-day-picker/moment";
import "react-day-picker/lib/style.css";
import styles from "./BasicFields.module.css";

const DatePicker = ({
  title,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const handleDayChange = day => {
    if (!editMode) {
      updateValue(currentIndex, "date", day);
    }
  };

  return (
    <div className={styles.DatePickerContainer}>
      <label>{title}</label>
      <DayPickerInput
        formatDate={formatDate}
        parseDate={parseDate}
        onDayChange={handleDayChange}
        placeholder={`${formatDate(new Date())}`}
        value={values ? `${formatDate(new Date(values.date))}` : ""}
      />
    </div>
  );
};

export default DatePicker;
