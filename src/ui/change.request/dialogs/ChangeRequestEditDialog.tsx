/* eslint-disable arrow-body-style */
import { createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";
import { DialogHandler } from "../../hooks/useDialog";
import ChangeRequestUpdateContainer from "../ChangeRequestUpdate.container";

interface Props {
  changeRequestId: string;
  changeOrderDialog: DialogHandler;
}

const styles = makeStyles(() =>
  createStyles({
    dialogPaper: {
      overflowY: "unset",
    },
    dialogContent: {
      overflowY: "unset",
    },
  })
);

const ChangeRequestEditDialog: React.FunctionComponent<Props> = ({
  changeRequestId,
  changeOrderDialog,
}) => {

  const classes = styles();

  const loadAsyncState =  useSelector(changeRequestsSelectors.getLoadAsyncState);
  const changeRequestDetails = useSelector((state: ApplicationState) =>
    changeRequestsSelectors.getChangeRequest(state, changeRequestId));

  const load = useActionCreator(changeRequestsActions.load);
  const loadAction = () => load(changeRequestId);

  return (
    <AsyncGate asyncAction={loadAction} asyncState={loadAsyncState} startActionOnMount={true}>
      <Dialog
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
        fullWidth={true}
        maxWidth="lg"
        open={changeOrderDialog.isOpen}
        onSubmit={(event: React.FormEvent) => event.stopPropagation()}
        classes={{ paper: classes.dialogContent }}
        id="ChangeOrder-dialog"
      >
        <DialogTitle>
          This is a Dialog - Yay
        </DialogTitle>
        <DialogContent
          classes={{ root: classes.dialogContent }}
          id="ChangeOrder-content"
        >
          <ChangeRequestUpdateContainer
            changeRequest={changeRequestDetails}></ChangeRequestUpdateContainer>
        </DialogContent>
      </Dialog>
    </AsyncGate>
  );
};

export default ChangeRequestEditDialog;
