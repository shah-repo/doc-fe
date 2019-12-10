import _ from "lodash";
import React from "react";
import { FBActionContainerProps } from "../../types/actions/action";
import actionCollection from "../../stores/domain/collections/FBActionCollection";
import FBAction from "../../components/actions/FBAction";

export const withActionContainer = <T extends FBActionContainerProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
      actions,
      ...props
  }: T) => {

    function doRenderActions(): boolean {
        return Boolean(actions && _.isString(_.first(actions)));
    }

    doRenderActions() && (actions =
        _.map(actions, (actionName: string) => {
            const action = actionCollection.getAction(actionName);
            return (action && <FBAction {...{action}} />);
        })
    )

    return Component({
      ...(props as T),
      actions,
    });
  };
};
