import { Box, ListItem, Tooltip, Typography } from "@material-ui/core";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { stripTags } from "../../../common/utils/helpers";
import { DataProps } from "../../../state/ducks/common/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ChangeRequestEditDialog from "../../change.request/dialogs/ChangeRequestEditDialog";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import Text from "../../components/Text";
import { FormHeaderContext } from "../../documentRevision/forms/DocumentRevisionForm.container";
import useDialog from "../../hooks/useDialog";
import useStyles from "./changeRequestLink.styles";

type Props = DataProps<DocumentRevision>;

const ChangeRequestLink: React.FunctionComponent<Props> = ({
  dataProp,
}) => {

  const { documentRevision } = React.useContext(FormHeaderContext) ?? {};
  let changeRequest = dataProp.changeRequest;
  if (documentRevision && !changeRequest) {
    changeRequest = documentRevision.changeRequest;
  }

  const classes = useStyles();

  const approvalRequestDialog = useDialog();
  const dispatch = useDispatch();

  if (!changeRequest) {
    return null;
  }

  const openChangeRequestDialog = () => {
    approvalRequestDialog.open();
  };

  const closeCRDialog = () => {
    approvalRequestDialog.close();
    dispatch(documentRevisionsActions.reload(dataProp?.id));
  };

  return (
    <ListItem className={classes.listItemPadding}>
      <Typography variant="h6">
        <Box fontSize={12}>
          <Text translation="common.crid"/>
        </Box>
        <div className={classes.linkContainer}>
          <Link
            to={changeRequestEditPath(changeRequest.id)}
            target="_blank"
            id="ChangeRequestLink-linkButton"
            className={classes.link}
          >
            <Tooltip title={stripTags(changeRequest.description)} id="ChangeRequestLink-tootlip" >
              <span>{changeRequest.crId}</span>
            </Tooltip>
          </Link>
          <VisibilityOutlinedIcon
            className={classes.viewIcon}
            onClick={openChangeRequestDialog}/>
        </div>
      </Typography>
      {
        approvalRequestDialog.isOpen &&
        <ChangeRequestEditDialog
          changeRequestId={changeRequest?.id}
          approvalRequestDialog={approvalRequestDialog}
          closeDialog = {closeCRDialog}
        />
      }
    </ListItem>
  );
};

export default ChangeRequestLink;
