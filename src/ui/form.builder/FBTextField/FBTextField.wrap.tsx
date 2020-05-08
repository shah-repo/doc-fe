import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FBTextFieldProps } from "..";
import { isTranslation } from "../../translations/types";

export const withFBTextField = <T extends FBTextFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    multiline,
    rows = 1,
    placeholder = "",
    ...props
  }: T) => {

    const intl = useIntl();

    (_.isUndefined(multiline)) && (
      multiline = Boolean(rows && (rows as number) > 1)
    );

    isTranslation(placeholder) && (placeholder = intl.formatMessage({ id: placeholder }));

    return Component({
      ...(props as T),
      multiline,
      placeholder,
      rows,
    });
  };
  return (props: T) => Comp(props);
};
