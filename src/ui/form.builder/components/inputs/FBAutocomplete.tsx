import Box from "@material-ui/core/Box/Box";
import { observer } from "mobx-react";
import React from "react";
import Select from "react-select";
import { SelectOption } from "../../../components/forms/fields/Select";
import FBLabel from "../../components/common/FBLabel";
import { withAutocompleteDefaults } from "../../hocs/withAutocompleteDefaults";
import autocompleteList from "../../stores/domain/collections/FBAutocompleteCollection";
import autocompleteEditorList from "../../stores/domain/collections/FBAutocompleteEditorCollection";
import { FBAutocompleteProps } from "../../types/autocomplete";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  label,
  autocompleteId,
  name,
  options,
  error,
  helperText,
  ...props
}) => {
  if (!options && autocompleteId) {
    const autocompleteIndicator = autocompleteEditorList.getBy(autocompleteId!);
    const { path, renderKey } = autocompleteIndicator || {};
    if (path && renderKey) {
      autocompleteList.setArgs(path, renderKey);
      autocompleteList.fetch();
    }
  }
  return (
    <FBLabel label={label}>
      {/* <Box border={1} borderColor={error ? "error.main" : "transparent"}> */}
      <Select
        {...props}
        inputId={`react-select-${name}`}
        TextFieldProps={{
          name,
          InputLabelProps: {
            htmlFor: `react-select-${name}`,
            shrink: true,
          },
        }}
        isDisabled={props.disabled}
        options={(options as SelectOption[]) || autocompleteList.data()}
      />
      {/* </Box> */}
      <Box mt={1} pl={1.5} fontSize="caption.fontSize" color="error.main">
        {helperText}
      </Box>
    </FBLabel>
  );
};

export default withAutocompleteDefaults(observer(FBAutocomplete));
