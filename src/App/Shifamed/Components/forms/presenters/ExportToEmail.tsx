import * as React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as SendToEmailIcon } from "../../../../../assets/images/send_to_email.svg";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { toastError, toastSuccess } from "../../../../../ui/components/notifications";
import Text from "../../../../../ui/components/Text";
import useActionCreator from "../../../../../ui/hooks/useActionCreator";
import useAsync from "../../../../../ui/hooks/useAsync";
import { StyledMenuListIcon } from "./StyledMenuListIcon";
import { StyledMenuListItem } from "./StyledMenuListItem";
import { StyledMenuListItemText } from "./StyledMenuListITemText";


interface Props {
  revisionId: string;
  canAccess: boolean;
}

const ExportToEmail: React.FunctionComponent<Props> = ({ revisionId, canAccess }) => {
  const intl = useIntl();
  const async = useAsync({
    onSuccess: () => {
      toastSuccess(intl.formatMessage({ id: "common.send.to.email.success" }));
    },
    onError: () => {
      if (!canAccess) {
        toastError(intl.formatMessage({ id: "common.send.to.email.no.access" }));
        return;
      }
      toastError(intl.formatMessage({ id: "common.send.to.email.error" }));
    },
  });

  const exportToEmail = useActionCreator(documentRevisionsActions.exportToEmail);

  const handleClick = () => {
    async.start(exportToEmail, revisionId, async);
  };

  return (
    <>
      <StyledMenuListItem
        button
        alignItems="flex-start"
      >
        <StyledMenuListIcon>
          <SendToEmailIcon />
        </StyledMenuListIcon>
        <StyledMenuListItemText
          primary={<Text translation="common.send.to.email" />}
          onClick={handleClick}
        />
      </StyledMenuListItem>
    </>
  );
};

export default ExportToEmail;
