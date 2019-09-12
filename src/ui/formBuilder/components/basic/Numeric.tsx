import React, { Fragment, useEffect, useState } from "react";
import styles from "./BasicFields.module.css";

interface NumericProps {
  title: string;
  placeholder?: string;
  tolerance: boolean;
  toleranceType: string;
  min?: string;
  max?: string;
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode?: boolean;
}

const Numeric: React.FunctionComponent<NumericProps> = ({
  title,
  tolerance,
  placeholder,
  toleranceType,
  min,
  max,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const defaulValue = values
    ? values
    : {
        value: "",
        minValue: "",
        maxValue: "",
      };
  const [fieldValues, setValue] = useState(defaulValue);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (e.target.value !== "") {
      newValue = Number(e.target.value.replace(/\D/g, "")).toLocaleString();
    }

    if (!editMode) {
      setValue({ ...fieldValues, [e.target.name]: newValue });
      updateValue(currentIndex, e.target.name, newValue);
    }
  };

  useEffect(() => {
    setError(!performCheck(fieldValues));
  }, [fieldValues]);

  const performCheck = (stateValues: any) => {
    const { minValue, maxValue, value } = stateValues;
    return (
      Number(minValue.replace(/\D/g, "")) <= Number(value.replace(/\D/g, "")) &&
      Number(maxValue.replace(/\D/g, "")) >= Number(value.replace(/\D/g, ""))
    );
  };

  const ToleranceSign = toleranceType === "percent" ? "%" : "";

  const ToleranceDiv = (
    <div className={styles.tolerance}>
      <div className={styles.toleranceSign}>
        <input
          name="minValue"
          onChange={handleChange}
          type="text"
          placeholder={min}
          defaultValue={fieldValues.minValue}
        />
        <span>{ToleranceSign}</span>
      </div>
      <div className={styles.toleranceSign}>
        <input
          name="maxValue"
          onChange={handleChange}
          type="text"
          placeholder={max}
          defaultValue={fieldValues.maxValue}
        />
        <span>{ToleranceSign}</span>
      </div>
    </div>
  );

  const showErrorMessage =
    error &&
    tolerance &&
    fieldValues.minValue &&
    fieldValues.value &&
    fieldValues.maxValue;

  const errorMessage = (
    <span className={styles.formError}>
      The value {fieldValues.value} is beyond the tolerance level
    </span>
  );

  const NumberField = (
    <div className={styles.numericField}>
      <label>{title}</label>
      <div className={styles.numericFieldsContainer}>
        <input
          onChange={handleChange}
          type="text"
          name="value"
          placeholder={placeholder}
          min={fieldValues.minValue || undefined}
          max={fieldValues.maxValue || undefined}
          defaultValue={fieldValues.value}
        />
        {tolerance ? ToleranceDiv : null}
        {showErrorMessage ? errorMessage : null}
      </div>
    </div>
  );

  return <Fragment>{NumberField}</Fragment>;
};

export default Numeric;
