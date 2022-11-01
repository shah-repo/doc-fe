import { Button } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";
import { StyledButton } from "../../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../../../App/Shifamed/Utils/SM/SM";
import { ReactComponent as SendToEmail } from "../../../../../assets/images/send_to_email.svg";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { toastError, toastSuccess } from "../../../../components/notifications";
import Text from "../../../../components/Text";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";


interface Props {
  revisionId: string;
  canAccess: boolean;
  renderAsButton?: boolean;
}

const ExportToEmail: React.FunctionComponent<Props> = ({ revisionId, canAccess, renderAsButton }) => {
  const isNewLayout = SM.isNewLayout;
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
  if (isNewLayout) {
    if (!renderAsButton) {
      return (<StyledMenuListItem button alignItems="flex-start">
        <StyledMenuListIcon><SendToEmail /></StyledMenuListIcon>
        <StyledMenuListItemText
          data-cy="exportToEmail"
          primary={<Text translation="common.send.to.email" />}
          onClick={handleClick}
        />
      </StyledMenuListItem>
      );
    }
    return (
      <StyledButton
        color="primary"
        data-cy="exportToEmail"
        onClick={handleClick}
      >
        <Text translation="common.send.to.email" />
      </StyledButton>
    );
  }

  return (
    <>
      <Button data-cy="exportToEmail" variant="outlined" color="secondary" onClick={handleClick}>
        <Text translation="common.send.to.email" />
      </Button>
    </>
  );
};

export default ExportToEmail;
