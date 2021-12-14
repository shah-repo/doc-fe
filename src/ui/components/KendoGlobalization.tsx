import { loadMessages, LocalizationProvider } from "@progress/kendo-react-intl";
import React from "react";
import { useIntl } from "react-intl";
import { isTranslation } from "../translations/types";


const KendoGlobalization: React.FunctionComponent = ({
  children,
}) => {
  const intl = useIntl();
  const messages = {
    grid: {
      groupPanelEmpty: isTranslation("kendo.groupPanelEmpty")
        ? intl.formatMessage({ id: "kendo.groupPanelEmpty" })
        : null,
    },
  };

  const language = "en";
  loadMessages(messages, language);

  return (
    <LocalizationProvider language={language}>
      {children}
    </LocalizationProvider>
  );
};

export default KendoGlobalization;
