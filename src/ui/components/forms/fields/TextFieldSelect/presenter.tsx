import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../Text";
import AutocompleteField from "../Autocomplete/Autocomplete";
import InputField from "../Input";
import { styles } from "./utils/styles";
import { TextFieldSelectProps } from "./utils/types";

type Props = TextFieldSelectProps;

export const EditableSelectPresenter: React.FunctionComponent<Props> = ({
  name = "",
  label = "",
  options = [],
  handleChange,
  value = "",
  gutter = true,
  isActive = false,
  disabled = false,
  handleBlur,
  isDisabled,
}) => {
  const classes = styles({ gutter, error: false });
  return (
    <Box className={classes.root}>
      <InputField
        name={name}
        label={label}
        inputProps={{
          multiline: true,
          rows: 2,
          value,
          onChange: handleChange,
          autoComplete: "off",
          onBlur: handleBlur,
          disabled,
        }}
        formControlProps={{ className: classes.textField }}
      />
      <AutocompleteField
        name="dummy"
        autocompleteProps={{
          // eslint-disable-next-line react/display-name
          noOptionsMessage: () => <Text message="document.emptyData" />,
          id: { name },
          isMulti: false,
          isClearable: false,
          styles,
          backspaceRemovesValue: false,
          inputProps: { id: "title" },
          value,
          menuIsOpen: value.length > 0 && isActive,
        }}
        formControlProps={{ className: classes.selectField }}
        options={options}
      />
    </Box>
  );
};

export default EditableSelectPresenter;
