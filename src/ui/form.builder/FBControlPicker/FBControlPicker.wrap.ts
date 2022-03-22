import { each, map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBControlPickerProps, FBControlPickerState } from "..";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";

export const withFBControlPicker = <T extends FBControlPickerProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    controlPickerState,
    pickers,
    ...props
  }: T) => {
    const intl = useIntl();
    const { workspaceState } = FB.useStores();
    controlPickerState = FB.useRef<FBControlPickerState>(FBControlPickerState, workspaceState);
    const translatedPickers = {};
    each(Object.keys(controlPickerState?.pickers), (value, key) => {
      translatedPickers[value] = map(controlPickerState?.pickers[value], (item) => ({
        label: intl.formatMessage({ id: `form.builder.${item}` }),
        key: item,
      }));
    });
    return Component({
      ...(props as T),
      controlPickerState,
      pickers: controlPickerState?.pickers,
      translatedPickers,
    });
  };

  return withFBEditorHelper((props: T) => Comp(props));
};
