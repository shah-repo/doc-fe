import React, { Fragment } from "react";

interface TextAreaProps {
  title: string;
  placeholder: string;
  closed: boolean;
  values?: any;
  updateValue?: any;
  currentIndex?: any;
  editMode: boolean;
}

const TextArea: React.FunctionComponent<TextAreaProps> = ({
  title,
  placeholder,
  closed,
  values,
  updateValue,
  currentIndex,
  editMode,
}) => {
  const setValue = (e: any) => {
    if (!editMode) {
      updateValue(currentIndex, e.target.name, e.target.value);
    }
  };

  return (
    <Fragment>
      <label>{title}</label>
      <textarea
        name={title}
        onChange={setValue}
        placeholder={placeholder}
        defaultValue={values ? values[title] : null}
      />
    </Fragment>
  );
};

export default TextArea;
