import { find, first, isString } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB } from "../..";
import FBAction from "../../components/actions/FBAction";
import FBActionContainerState from "../../components/actions/FBActionContainer.state";
import { FBActionModel } from "../../stores/domain/models/FBActionModel";
import { FBActionContainerProps } from "../../types/actions/action";

export const withActionContainer = <T extends FBActionContainerProps>(
  Component: React.FunctionComponent<T>,
) => ({
  actions,
  state,
  ...props
}: T) => {

  state = FB.useRef<FBActionContainerState>(FBActionContainerState);
  function doRenderActions(): boolean {
    return Boolean(actions && isString(first(actions)));
  }

  return useObserver(() => {

    doRenderActions() && (actions =
        (actions || []).map((actionName, index) => {
          const action = find(state?.data, (d: FBActionModel) => d.name === actionName);
          return (action && <FBAction key={`${actionName}-${index}`} {...{ action }} />);
        })
    );

    return Component({
      ...(props as T),
      actions,
    });
  });
};
