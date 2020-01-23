import _ from "lodash";
import React from "react";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import { FBAutocompleteModel } from "../../stores/domain/models/FBAutocompleteModel";
import { FBAutocompleteEditorProps } from "../../types/editors/autocomplete";
import { withFormik } from "../common/withFormik";

export const withAutocompleteEditor = <T extends FBAutocompleteEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    form,
    ...props
  }: T) => {

    function getOption(id: string): Partial<FBAutocompleteModel> {
      const option = _.filter(autocompleteOptions, { id })[0];
      return option;
    }

    const afterChange = (fieldName: string, value: string) => {
        if (!form) {
          return;
        }
        const { path, renderKey } = getOption(value);
        form!.setFieldValue("optionPath", path);
        form!.setFieldValue("optionRenderKey", renderKey);
    };

    return Component({
      ...(props as T),
      afterChange,
    });
  };

  return withFormik((props: T) => Comp(props));
};
