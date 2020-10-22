import { map } from "lodash";
import * as React from "react";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Props } from "react-intl/lib/components/message";
import { isTranslation, Translation } from "../translations/types";

export interface TextProps extends Props {
  /** id of the translation */
  translation?: Translation;
  /** id of the translation or string to display */
  message?: Translation | string;
  dataCy?: string;
}

const Text: React.FunctionComponent<TextProps> = ({
  message = "",
  translation = "translation.unknown",
  dataCy = "",
  values = {},
  ...props
}: TextProps) => {
  const intl = useIntl();
  const [hasTranslation, text] = useMemo(() => {
    const stringToCheck = message || translation;
    if (!stringToCheck || typeof stringToCheck !== "string") {
      return [false, stringToCheck];
    }

    if (isTranslation(stringToCheck)) {
      return [true, stringToCheck];
    }

    const strippedLastPart = stringToCheck.split(".").slice(0, -1).join(".");

    if (isTranslation(strippedLastPart)) {
      return [true, strippedLastPart];
    }

    return [false, stringToCheck];
  }, [message, translation]);

  // For values locale
  useMemo(() => {
    map(values, (value, key) => {
      if (!isTranslation(value as string)) { return; }
      values[key] =  intl.formatMessage({ id: value as string });
    });
  }, [values, intl]);

  if (hasTranslation && dataCy !== "") {
    return <div data-cy={dataCy}><FormattedMessage id={text} {...props} {...{ values }} /></div>;
  }
  else if (hasTranslation) {
    return <FormattedMessage id={text} {...props} {...{ values }} />;
  }

  if (dataCy !== "") {
    return <span data-cy={dataCy}>{text}</span>;
  }

  return <span>{text}</span>;
};

export default Text;
