import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Props } from "react-intl/lib/components/message";
import { isTranslation, Translation } from "../translations/types";

export interface TextProps extends Props {
  /** id of the translation */
  translation?: Translation;
  /** id of the translation or string to display */
  message?: Translation | string;
}

const Text: React.FunctionComponent<TextProps> = ({
  message = "",
  translation = "translation.unknown",
  ...props
}: TextProps) => {
  let translationId = translation;

  if (message) {
    if (!isTranslation(message)) {
      return <span>{message}</span>;
    }

    translationId = message;
  }

  return <FormattedMessage id={translationId} {...props} />;
};

export default Text;
