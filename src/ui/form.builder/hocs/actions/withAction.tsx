import _ from "lodash";
import React from "react";
import { FBActionProps } from "../../types/actions/action";
import { FBFieldComponent } from "../../defaults/editor";
import FBButton from "../../components/inputs/FBButton";
import FBStore from "../../stores/ui/FBStore";

export const withAction = <T extends FBActionProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    action,
    ...props
  }: T) => {

    const onClick = () => {
      alert(action.name);
    }

    const indicators = _.map(action.indicators, (indicator) => {
      const InputType = FBFieldComponent[indicator.type || ""];
      return (
        <InputType {...indicator} {...FBStore.fieldMode} />
      );
    });

    const actionButton = (
      <FBButton
        label={action.actionLabel}
        onClick={onClick}
        {...FBStore.fieldMode}
      />
    );

    return Component({
      ...(props as T),
      indicators,
      actionButton,
    });
  };
};
