import { Button } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";
import { SM } from "../../../App";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import { ReactComponent as SendToEmail } from "../../../assets/images/send_to_email.svg";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { toastError, toastSuccess } from "../../components/notifications";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface Props {
  id: string;
  renderAsButton?: boolean;
}

const ExportARToEmail: React.FunctionComponent<Props> = ({
  id, renderAsButton,
}) => {
  const intl = useIntl();
  const exportTrainingRecordEmail = useActionCreator(changeRequestsActions.exportAR);
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;
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
    if (!renderAsButton) {
      return (<StyledMenuListItem button alignItems="flex-start" onClick={handleAREmail}>
        <StyledMenuListIcon><SendToEmail /></StyledMenuListIcon>
        <StyledMenuListItemText
          data-cy="exportToEmail"
          primary={<Text translation="common.send.to.email" />}
        />
      </StyledMenuListItem>
      );
    }
    return (
      <StyledButton
        color="primary"
        style={{ margin: 0 }}
        data-cy="exportToEmail"
        onClick={handleAREmail}
      >
        <Text translation="common.send.to.email" />
      </StyledButton>
    );
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      data-cy="exportToEmail"
      style={{ margin: 0 }}
      onClick={() => handleAREmail()}
    >
      <Text translation="common.send.to.email" />
    </Button>
  );
};

export default ExportARToEmail;
