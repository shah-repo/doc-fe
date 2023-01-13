/* eslint-disable arrow-body-style */
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { useSelector } from "react-redux";
import { ReactComponent as NewTabIcon } from "../../../assets/images/new_tab.svg";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import { DialogHandler } from "../../hooks/useDialog";
import ChangeRequestUpdateContainer from "../ChangeRequestUpdate.container";
import { changeRequestPreviewPath } from "../utils/paths";
import useStyles from "./ChangeRequestEditDialog.styles";

interface Props {
  changeRequestId: string;
  approvalRequestDialog: DialogHandler;
  closeDialog: () => void;
  currentDocRevId?: string;
}

const ChangeRequestEditDialog: React.FunctionComponent<Props> = ({
  changeRequestId,
  approvalRequestDialog,
  closeDialog,
  currentDocRevId,
}) => {

  const classes = useStyles();

  const loadAsyncState =  useSelector(changeRequestsSelectors.getLoadAsyncState);
  const changeRequestDetails = useSelector((state: ApplicationState) =>
    changeRequestsSelectors.getChangeRequest(state, changeRequestId));

  const load = useActionCreator(changeRequestsActions.load);
  const loadAction = () => load(changeRequestId);

  const handleOpenNewTab = () => {
    window.open(changeRequestPreviewPath(changeRequestId));
  };

  return (
    <AsyncGate asyncAction={loadAction} asyncState={loadAsyncState} startActionOnMount={true}>
      <Dialog
        disableBackdropClick={true}
        disableEnforceFocus
        classes={{
          root: classes.root,
          paper: classes.paper,
        }}
        scroll="paper"
        disableEscapeKeyDown={true}
        style={{ maxWidth: "none" }}
        maxWidth={false}
        open={approvalRequestDialog.isOpen}
        onSubmit={(event: React.FormEvent) => event.stopPropagation()}
        id="ApprovalRequest-dialog"
      >
        <DialogTitle style={{ display: "flex" }} disableTypography>
          <Typography className={classes.heading}>
            <Text translation="approvalRequest.dialog.title" />
          </Typography>
          <IconButton
            className={classes.close}
            size="small"
            onClick={handleOpenNewTab}
          >
            <NewTabIcon />
          </IconButton>
          <IconButton
            className={classes.close}
            size="small"
            onClick={closeDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers
          id="ApprovalRequest-content"
        >
          <ChangeRequestUpdateContainer
            changeRequest={changeRequestDetails}
            hideSideBar
            currentDocRevId={currentDocRevId}
            inDialog={true}/>
        </DialogContent>
      </Dialog>
    </AsyncGate>
  );
};

export default ChangeRequestEditDialog;
