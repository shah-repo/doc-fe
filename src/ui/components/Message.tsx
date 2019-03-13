import * as React from "react";
import { FormattedMessage } from "react-intl";
import { isTranslation, Translation } from "../translations/types";

interface Props extends FormattedMessage.Props {
  /** id of the translation or string to display */
  id: Translation | string;
}

const Message: React.FunctionComponent<Props> = (props) => {
  if (!isTranslation(props.id)) {
    return <span>{props.id}</span>;
  }

  return <FormattedMessage {...props} />;
};

export default Message;
