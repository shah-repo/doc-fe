import { observer } from "mobx-react";
import React from "react";
import Select from "react-select";
import FBLabel from "../../components/common/FBLabel";
import { withAutocompleteDefaults } from "../../hocs/withAutocompleteDefaults";
import autocompleteList from "../../stores/domain/collections/FBAutocompleteCollection";
import autocompleteEditorList from "../../stores/domain/collections/FBAutocompleteEditorCollection";
import FBStore from "../../stores/FBStore";
import { FBAutocompleteProps } from "../../types/autocomplete";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  label,
  autocompleteId,
  name,
  options,
  ...props
}) => {

  if (!options && autocompleteId && FBStore.mode === "form") {
    const autocompleteIndicator = autocompleteEditorList.getBy(
      autocompleteId!,
    );
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
        options={options || autocompleteList.data()}
      />
    </FBLabel>
  );
};

export default withAutocompleteDefaults(observer(FBAutocomplete));
