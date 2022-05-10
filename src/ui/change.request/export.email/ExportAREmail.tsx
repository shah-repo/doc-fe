import { Button } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";
import { SM } from "../../../App";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { toastError, toastSuccess } from "../../components/notifications";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface Props {
  id: string;
}

const ExportARToEmail: React.FunctionComponent<Props> = ({
  id,
}) => {
  const intl = useIntl();
  const exportTrainingRecordEmail = useActionCreator(changeRequestsActions.exportAR);
  const isNewLayout = SM.isNewCRLayout;
  const async = useAsync({
    onSuccess: () => {
      toastSuccess(intl.formatMessage({ id: "common.send.to.email.success" }));
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "common.send.to.email.error"  }));
    },
  });

  const handleAREmail = () => {
    async.start(exportTrainingRecordEmail, id, async);
  };

  if (isNewLayout) {
    return (
      <StyledButton
        color="primary"
        style={{ margin: 0 }}
        onClick={() => handleAREmail()}
      >
        <Text translation="common.send.to.email" />
      </StyledButton>
    );
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      style={{ margin: 0 }}
      onClick={() => handleAREmail()}
    >
      <Text translation="common.send.to.email" />
    </Button>
  );
};

export default ExportARToEmail;
