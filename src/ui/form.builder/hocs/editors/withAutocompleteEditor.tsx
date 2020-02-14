import _ from "lodash";
import React from "react";
import { FBAutocompleteIndicator } from "../..";
import autocompleteOptions from "../../../../data/autocompleteOptions.json";
import { FBAutocompleteEditorProps } from "../../types/editors/autocomplete";
import { withFormik } from "../common/withFormik";

export const withAutocompleteEditor = <T extends FBAutocompleteEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    form,
    ...props
  }: T) => {

    function getOption(id: string): Partial<FBAutocompleteIndicator> {
      const option = _.filter(autocompleteOptions, { id })[0];
      return option;
    }

    const afterChange = (fieldName: string, value: string) => {
        if (!form) {
          return;
        }
        const { path, optionLabelKey, optionValueKey } = getOption(value);
        form!.setFieldValue("optionPath", path);
        form!.setFieldValue("optionLabelKey", optionLabelKey);
        form!.setFieldValue("optionValueKey", optionValueKey);
    };

    return Component({
      ...(props as T),
      afterChange,
    });
  };

  return withFormik((props: T) => Comp(props));
};
