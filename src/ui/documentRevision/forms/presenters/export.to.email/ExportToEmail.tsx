import { Button } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";
import { StyledButton } from "../../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { toastError, toastSuccess } from "../../../../components/notifications";
import Text from "../../../../components/Text";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";


interface Props {
  revisionId: string;
  canAccess: boolean;
  newVariant?: boolean;
}

const ExportToEmail: React.FunctionComponent<Props> = ({ revisionId, canAccess, newVariant }) => {
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
  if (newVariant) {
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
