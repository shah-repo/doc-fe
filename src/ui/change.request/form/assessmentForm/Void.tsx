import { Box, Button } from "@material-ui/core";
import React from "react";
import { SM } from "../../../../App";
import { StyledMenuListIcon } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import { ReactComponent as VoidDocumentIcon } from "../../../../assets/images/void_document.svg";
import { changeRequestsActions } from "../../../../state/ducks/changeRequest";
import { ChangeRequest } from "../../../../state/ducks/changeRequest/types";
import { AsyncStatus } from "../../../../state/types";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  changeRequest: ChangeRequest | undefined;
}
const AssessmentFormVoidContainer: React.FunctionComponent<Props> = ({
  changeRequest,
}) => {
  const dialog = useDialog();
  const appyTransitionAction = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync();
  const voidDocument = () => {
    changeRequest
    && async.start(
      appyTransitionAction,
      changeRequest.id,
      { password: "" },
      "void",
      async,
    );
  };
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;

  if (!changeRequest) {
    return null;
  }

  return (
    <>
      <Box position="absolute" marginTop="-50px">
        <FormMessage asyncState={async.asyncState} />
        <FormProgress asyncState={async.asyncState} />
      </Box>
      {isNewLayout ? (
        <StyledMenuListItem
          button
          disabled={async.asyncState.status === AsyncStatus.Active}
          alignItems="flex-start"
        >
          <StyledMenuListIcon>
            <VoidDocumentIcon />
          </StyledMenuListIcon>
          <StyledMenuListItemText
            id="void-button"
            data-cy="void-button"
            primary={<Text translation="common.void" />}
            onClick={dialog.open}
          />
        </StyledMenuListItem>
      ) : (
        <Button
          id="void-button"
          data-cy="void-button"
          variant="outlined"
          color="secondary"
          onClick={dialog.open}
          disabled={async.asyncState.status === AsyncStatus.Active}
        >
          <Text translation="common.void" />
        </Button>
      )}
      <AlertDialog
        confirmAction={voidDocument}
        message={"change.request.void.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default AssessmentFormVoidContainer;
