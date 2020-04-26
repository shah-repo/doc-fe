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
    index = 0,
    topBarMargin = 0,
    grabMargin = 0,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    fieldWrapperState = FB.useRef<FBFieldWrapperState>(FBFieldWrapperState);

    const { label, type } = workspaceState?.getSchemaItemAt(index) || {};

    if (!_.includes(FBSchemaState.omitLabel, type) && !_.isUndefined(label)) {
      topBarMargin = -3;
      grabMargin = 3.5;
    }

    const onMouseOver = () => fieldWrapperState?.setToolsActive(true);
    const onMouseLeave = () => fieldWrapperState?.setToolsActive(false);

    return useObserver(() => Component({
      ...(props as T),
      onMouseOver,
      onMouseLeave,
      toolsVisible: fieldWrapperState?.toolsVisible,
      markDownVisible: fieldWrapperState?.markDownVisible,
      topBarMargin,
      grabMargin,
      index,
      fieldWrapperState,
    }));
  };

  return (props: T) => Comp(props);
};
