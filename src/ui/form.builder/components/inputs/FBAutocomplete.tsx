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
      <Select
        {...props}
        inputId={`react-select-${name}`}
        TextFieldProps={{
          InputLabelProps: {
            htmlFor: `react-select-${name}`,
            shrink: true,
          },
        }}
        isDisabled={props.disabled}
        options={(options as SelectOption[]) || autocompleteList.data()}
        isMulti={true}
      />
    </FBLabel>
  );
};

export default withAutocompleteDefaults(observer(FBAutocomplete));
