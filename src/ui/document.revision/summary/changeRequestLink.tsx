import { ListItem, Typography, WithStyles, withStyles, Tooltip } from "@material-ui/core";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import { Link } from "react-router-dom";

type Props = DataProps<DocumentRevision>;

export const ChangeRequestLink: React.FunctionComponent<Props> = ({
  dataProp,
}) => {
  if (!dataProp.changeRequest) {
    return null;
  }

  const { changeRequest } = dataProp;

  return(
    <ListItem>
      <Typography variant="h5">
        <Text translation="common.crid" />:&nbsp;
        <Link to={changeRequestEditPath(changeRequest.id)} target="_blank">
          <Tooltip title={changeRequest.description}>
            <span>{changeRequest.crId}</span>
          </Tooltip>
        </Link>
      </Typography>
    </ListItem>
  );
};

export default ChangeRequestLink;
