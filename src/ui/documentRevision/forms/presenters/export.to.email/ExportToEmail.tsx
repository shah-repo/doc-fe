import * as React from "react";
import { useIntl } from "react-intl";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { toastError, toastSuccess } from "../../../../components/notifications";
import Text from "../../../../components/Text";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import { StyledButton } from "../StyledListButton";


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
      <StyledButton data-cy="exportToEmail" color="primary" onClick={handleClick}>
        <Text translation="common.send.to.email" />
      </StyledButton>
    </>
  );
};

export default ExportToEmail;
