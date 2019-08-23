import { ListItem, Tooltip, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import Text from "../../components/Text";
import { stripTags } from "../../../common/utils/helpers";

type Props = DataProps<DocumentRevision>;

export const ChangeRequestLink: React.FunctionComponent<Props> = ({
  dataProp,
}) => {
  if (!dataProp || !dataProp.changeRequest) {
    return null;
  }

  const { changeRequest } = dataProp;

  return(
    <ListItem>
      <Typography variant="h5">
        <Text translation="common.crid" />:&nbsp;
        <Link to={changeRequestEditPath(changeRequest.id)} target="_blank">
          <Tooltip title={stripTags(changeRequest.description)}>
            <span>{changeRequest.crId}</span>
          </Tooltip>
        </Link>
      </Typography>
    </ListItem>
  );
};

export default ChangeRequestLink;
