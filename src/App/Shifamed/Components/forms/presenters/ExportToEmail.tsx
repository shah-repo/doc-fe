import * as React from "react";
import { useIntl } from "react-intl";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { toastError, toastSuccess } from "../../../../../ui/components/notifications";
import Text from "../../../../../ui/components/Text";
import useActionCreator from "../../../../../ui/hooks/useActionCreator";
import useAsync from "../../../../../ui/hooks/useAsync";
import { StyledButton } from "./StyledListButton";


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
