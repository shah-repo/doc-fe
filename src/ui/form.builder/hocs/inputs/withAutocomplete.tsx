import { observer } from "mobx-react";
import React from "react";
import { FBAutocompleteProps } from "../../types/autocomplete";
import { withOnChange } from "../withOnChange";

export const withAutocomplete = <T extends FBAutocompleteProps>(
  Component: React.FunctionComponent<T>,
) => {
  return withOnChange(observer(
    ( props: T) => {
      return Component({...props});
      // const renderInput = (params: RenderInputParams) => (
      //   <TextField {...params} variant="outlined" fullWidth />
      // );

      // if (autocompleteId && FBStore.mode === 'form') {
      //   const autocompleteIndicator = autocompleteEditorList.getBy(
      //     autocompleteId,
      //   );
      //   const { path, renderKey } = autocompleteIndicator || {};
      //   if (path && renderKey) {
      //     autocompleteList.setArgs(path, renderKey);
      //     autocompleteList.fetch();
      //     optionLabel = renderKey;
      //     options = autocompleteList.data();
      //   }
      // }

      // if (!getOptionLabel) {
      //   getOptionLabel = (option: any) => option[optionLabel || ''];
      // }

      // return Component({
      //   ...(props as T),
      //   options,
      //   optionLabel,
      //   autocompleteId,
      //   getOptionLabel,
      //   renderInput,
      // });
    },
  ),
  );
};
