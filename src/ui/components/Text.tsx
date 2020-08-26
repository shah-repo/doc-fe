import * as React from "react";
import { FormattedMessage } from "react-intl";
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
  ...props
}: TextProps) => {
  const [hasTranslation, text] = React.useMemo(() => {
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

  if (hasTranslation) {
    return <FormattedMessage id={text} {...props} />;
  }

  if (dataCy !== "") {
    return <span data-cy={dataCy}>{text}</span>;
  }

  return <span>{text}</span>;
};

export default Text;
