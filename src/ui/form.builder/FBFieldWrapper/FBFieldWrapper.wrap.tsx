import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBFieldWrapperProps, FBFieldWrapperState } from ".";
import { FB, FBSchemaState } from "..";

export const withFBFieldWrapper = <T extends FBFieldWrapperProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    fieldWrapperState,
    topBarMargin = 0,
    grabMargin = 0,
    toolsVisible,
    addToolVisible,
    markDownVisible,
    inputProps,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    const { index = 0, designDisabled = false } = inputProps || {};
    fieldWrapperState = FB.useRef<FBFieldWrapperState>(FBFieldWrapperState);

    const { label, type } = workspaceState?.getSchemaItemAt(index) || {};

    if (!_.includes(FBSchemaState.omitLabel, type) && !_.isUndefined(label)) {
      topBarMargin = -3;
      grabMargin = 3.5;
    }

    const onMouseOver = () => {
      if (fieldWrapperState) {
        !designDisabled && fieldWrapperState.setToolsActive(true);
        fieldWrapperState.setAddToolActive(true);
      }
    };
    const onMouseLeave = () => {
      fieldWrapperState?.setToolsActive(false);
      fieldWrapperState?.setAddToolActive(false);
    };

    useObserver(() => {
      toolsVisible = fieldWrapperState?.toolsVisible;
      addToolVisible = fieldWrapperState?.addToolVisible;
      markDownVisible = fieldWrapperState?.markDownVisible;
    });

    return useObserver(() => Component({
      ...(props as T),
      onMouseOver,
      onMouseLeave,
      fieldWrapperState,
      toolsVisible,
      addToolVisible,
      markDownVisible,
      designDisabled,
      topBarMargin,
      grabMargin,
      inputProps,
    }));
  };

  return (props: T) => Comp(props);
};
