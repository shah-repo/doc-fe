import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { ChangeRequestStatus } from "../../../../state/ducks/changeRequest";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { useDocumentStatus } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";

export interface Props {
  status: string;
  id: string;
  name: string;
  documentTypeId?: string;
}

export const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
}) => {
  const [isStatusVisible, statusLabel] = useDocumentStatus(documentTypeId, status);
  const classes = styles();
  const isStatusReleased = status === DocumentRevisionStatus.Released || status === ChangeRequestStatus.Approved;
  const isStatusCanceled = status === DocumentRevisionStatus.Canceled || status === ChangeRequestStatus.Voided;
  const statusIcon =
    <div className={classNames(classes.statusIconDefault, {
      [classes.statusIconReleased]: isStatusReleased,
      [classes.statusIconCanceled]: isStatusCanceled,
    })}/>;

  return (
    <Grid container={true} xs={6} alignItems="center">
      {
        isStatusVisible &&
        <Chip
          label={<Text message={statusLabel} />}
          id="HeaderInfo-status"
          className={classNames(classes.statusDefault)}
          icon={statusIcon}
        />
      }
      <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} >
        {id}
      </Typography>
      <Typography variant="h6" id="HeaderInfo-name">
        {name}
      </Typography>
    </Grid>
  ); };

export default HeaderInfo;
