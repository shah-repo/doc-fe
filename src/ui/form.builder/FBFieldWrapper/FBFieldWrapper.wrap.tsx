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
    designDisabled = false,
    ...props
  }: T) => {

    state = FB.useRef<FBFieldWrapperState>(FBFieldWrapperState);
    const { label, type } = FBStore.getSchemaItem(index) || {};

    const isSection: boolean = _.includes(FBEditorSectionConfig.section, type);

    (!isSection && !_.isEmpty(label)) && (topBarMargin = -3);
    !state.markDownVisible && (bottomBarMargin = -3);

    const onMouseOver = () => {
      if (state) {
        !designDisabled && state.setToolsActive(true);
        state.setAddToolActive(true);
      }
    };
    const onMouseLeave = () => {
      state?.setToolsActive(false);
      state?.setAddToolActive(false);
    };

    return useObserver(() => Component({
      ...(props as T),
      onMouseOver,
      onMouseLeave,
      toolsVisible: state?.toolsVisible,
      addToolVisible: state?.addToolVisible,
      markDownVisible: state?.markDownVisible,
      designDisabled,
      topBarMargin,
      bottomBarMargin,
      index,
      state,
    }));
  };

  return (props: T) => Comp(props);
};
