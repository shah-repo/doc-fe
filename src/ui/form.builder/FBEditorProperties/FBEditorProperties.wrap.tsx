import _ from "lodash";
import React from "react";
import { FBEditorPropertiesProps, FBEditorPropertiesState } from ".";
import { FB } from "..";
import { withFBOption } from "../FBOption/FBOption.wrap";


export const withFBEditorProperties = <T extends FBEditorPropertiesProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    editorPropsState,
    type,
    options,
    ...props
  }: T) => {

    editorPropsState = FB.useRef<FBEditorPropertiesState>(FBEditorPropertiesState);
    _.isEmpty(options) && (options = editorPropsState.getOptions(type));

    return Component({
      ...(props as T),
      options,
    });
  };

  return withFBOption((props: T) => Comp(props));
};
