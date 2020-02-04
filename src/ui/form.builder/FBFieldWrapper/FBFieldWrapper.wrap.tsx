import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBFieldWrapperProps, FBFieldWrapperState } from ".";
import { FB } from "..";
import { FBEditorSectionConfig } from "../defaults/editor";
import FBStore from "../stores/ui/FBStore";

export const withFBFieldWrapper = <T extends FBFieldWrapperProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    state,
    index = 0,
    topBarMargin = 0,
    bottomBarMargin = 0,
    ...props
  }: T) => {

    state = FB.useRef<FBFieldWrapperState>(FBFieldWrapperState);
    const { label, type } = FBStore.getSchemaItem(index) || {};

    const isSection: boolean = _.includes(FBEditorSectionConfig.section, type);

    (!isSection && !_.isEmpty(label)) && (topBarMargin = -3);
    !state.markDownVisible && (bottomBarMargin = -3);

    const onMouseOver = () => state?.setToolsActive(true);
    const onMouseLeave = () => state?.setToolsActive(false);

    return useObserver(() => Component({
      ...(props as T),
      onMouseOver,
      onMouseLeave,
      toolsVisible: state?.toolsVisible,
      markDownVisible: state?.markDownVisible,
      topBarMargin,
      bottomBarMargin,
      index,
      state,
    }));
  };

  return (props: T) => Comp(props);
};
