import { Box } from "@material-ui/core";
import React from "react";
import Select from "react-select";
import { withAutocompleteDefaults } from "../../hocs/withAutocompleteDefaults";
import autocompleteList from "../../stores/collections/FBAutocompleteCollection";
import { FBAutocompleteProps } from "../../types/autocomplete";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  labelRenderer,
  disabled,
  readOnly,
  ...props
}) => {
  // *NOTE: For demo only. Will be removed
  // const [options] = useState<SelectOption[]>([]);
  autocompleteList.fetch();
  const options = autocompleteList.options();
  return (
    <Box mb={4}>
      {labelRenderer}
      <Select
        inputId={`react-select-${props.name}`}
        TextFieldProps={{
          InputLabelProps: {
            htmlFor: `react-select-${props.name}`,
            shrink: true,
          },
        }}
        isDisabled={disabled || readOnly}
        {...props}
        options={options}
      />
    </Box>
  );
};

export default withAutocompleteDefaults(FBAutocomplete);
