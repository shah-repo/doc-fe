import { Button } from "@material-ui/core";
import * as React from "react";
import { documentRevisionsActions } from "../../../../../state/ducks/documentRevisions";
import { toastError, toastSuccess } from "../../../../components/notifications";
import Text from "../../../../components/Text";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";


interface Props {
  revisionId: string;
}

const ExportToEmail: React.FunctionComponent<Props> = ({ revisionId }) => {
  const async = useAsync({
    onSuccess: () => {
      toastSuccess("File will be sent to your email shortly.");
    },
    onError: () => {
      toastError("Action is not available at the moment, please try again later.");
    },
  });

  const exportToEmail = useActionCreator(documentRevisionsActions.exportToEmail);

  const handleClick = () => {
    async.start(exportToEmail, revisionId, async);
  };

  return (
    <>
      <Button data-cy="exportToEmail" variant="outlined" color="secondary" onClick={handleClick}>
        <Text translation="common.send.to.email" />
      </Button>
    </>
  );
};

export default ExportToEmail;
