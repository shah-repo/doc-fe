import React from "react";
import { FBAutocompleteAsync } from "..";
import { FBEBPartAutocompleteProps } from "./FBEBPartAutocomplete.types";

const FBEBPartAutocomplete: React.FunctionComponent<FBEBPartAutocompleteProps> = ({
  disabled,
  loading,
  name,
  defaultValue,
  additionalData,
  forceNewRender,
  autocompleteOption,
}) => (
  <FBAutocompleteAsync
    label="form.builder.part"
    placeholder="form.builder.select.existing.part"
    optionId={autocompleteOption}
    gutter={false}
    shouldReloadOnInit
    withState
    {...{ disabled, loading, name, defaultValue, additionalData, forceNewRender }}
  />
);

export default FBEBPartAutocomplete;
