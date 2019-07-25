import { ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
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

  return(
    <ListItem>
      <Typography variant="h5">
        <Text translation="document.revision.list.crId" />:&nbsp;
        <Link to={changeRequestEditPath(dataProp.changeRequest.id)} target="_blank">
          {dataProp.changeRequest.crId}
        </Link>
      </Typography>
    </ListItem>
  );
};

export default ChangeRequestLink;
