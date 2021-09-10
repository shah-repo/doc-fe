import { forIn, isString } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { isTranslation } from "../../../../ui/translations/types";
import { SMTextProps } from "./SMText.types";

export const withSMText = <T extends SMTextProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    label,
    ...props
  }: T) => {
    const intl = useIntl();
    if (!isString(label) && label && label.values) {
      forIn(label.values  as Record<string, string>, (value, key) => {
        if (isTranslation(value)) {
          ((label).values as Record<string, string>)[key] =
            intl.formatMessage({ id: (label).values?.[key] as string });
        }
      });
    }

    return  Component({
      ...(props as T),
      label,
    });
  };
  Comp.displayName = "withFBNotes";
  return Comp;
};
