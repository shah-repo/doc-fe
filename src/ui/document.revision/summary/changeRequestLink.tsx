import { Box, ListItem, Tooltip, Typography } from "@material-ui/core";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import React from "react";
import { Link } from "react-router-dom";
import { stripTags } from "../../../common/utils/helpers";
import { DataProps } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ChangeRequestEditDialog from "../../change.request/dialogs/ChangeRequestEditDialog";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import Text from "../../components/Text";
import { useCRLink } from "../../hooks/docCustomization/useCustomization";
import useDialog from "../../hooks/useDialog";
import useStyles from "./changeRequestLink.styles";

type Props = DataProps<DocumentRevision>;

const ChangeRequestLink: React.FunctionComponent<Props> = ({
  dataProp,
}) => {

  const classes = useStyles();

  const changeOrderDialog = useDialog();

  const { isVisible } = useCRLink(dataProp?.document?.documentType?.id);
  if (!dataProp || !dataProp.changeRequest) {
    return null;
  }

  const { changeRequest } = dataProp;

  if (!isVisible) {
    return null;
  }

  const openChangeRequestDialog = () => {
    changeOrderDialog.open();
  };

  return (
    <ListItem style={{ padding: 0 }}>
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
        changeOrderDialog.isOpen &&
        <ChangeRequestEditDialog
          changeRequestId={dataProp.changeRequest?.id} changeOrderDialog={changeOrderDialog}
        />
      }
    </ListItem>
  );
};

export default ChangeRequestLink;
