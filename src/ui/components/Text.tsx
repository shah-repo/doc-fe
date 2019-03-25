import * as React from "react";
import { FormattedMessage } from "react-intl";
import { isTranslation, Translation } from "../translations/types";

type FormattedMessageProps = Pick<FormattedMessage.Props, Exclude<keyof FormattedMessage.Props, "id">>;

export interface TextProps extends Partial<FormattedMessageProps> {
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
