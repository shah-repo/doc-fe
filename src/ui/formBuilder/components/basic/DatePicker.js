import React from "react";
import styles from "./BasicFields.module.css";

const DatePicker = ({
  title,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const handleDayChange = (day) => {
    if (!editMode) {
      updateValue(currentIndex, "date", day);
    }
  };

  return <div />;
};

export default DatePicker;
