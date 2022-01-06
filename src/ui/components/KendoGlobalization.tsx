import { loadMessages, LocalizationProvider } from "@progress/kendo-react-intl";
import React from "react";
import { useIntl } from "react-intl";
import { isTranslation } from "../translations/types";


const KendoGlobalization: React.FunctionComponent = ({
  children,
}) => {
  const intl = useIntl();
  const getDisplayText = (localiseString) =>
    isTranslation(localiseString)
      ? intl.formatMessage({ id: localiseString })
      : null;
  const messages = {
    grid: {
      filterBooleanAll: getDisplayText("common.all"),
      filterIsTrue: getDisplayText("common.true"),
      filterIsFalse: getDisplayText("common.false"),
      groupPanelEmpty: getDisplayText("kendo.groupPanelEmpty"),
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
