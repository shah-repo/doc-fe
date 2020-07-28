import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { ChangeRequestStatus } from "../../../../state/ducks/changeRequest";
import { DocumentRevisionStatus, DocumentRevisionStatusAlias } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType";
import { FBDocTypeGroup } from "../../../form.builder";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";

export interface Props {
  status: string;
  id: string;
  name: string;
  documentTypeId?: string;
  revision?: number;
  groupOptions?: DocumentGroupOptionsType[];
  isInlineApproval?: boolean;
}

export const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  revision,
  groupOptions,
  isInlineApproval,
}) => {
  // we should rename enum for document types, it is not only for FB
  if (revision === 1 && groupOptions?.includes(FBDocTypeGroup.RECORD) && isInlineApproval) {
    status = DocumentRevisionStatusAlias.Draft;
  }
  const [isStatusVisible, statusLabel] = useDocumentStatus(documentTypeId, status);
  const [isTitleVisible] = useTitle(documentTypeId);
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
      {
        isTitleVisible &&
        <Typography variant="h6" id="HeaderInfo-name">
          {name}
        </Typography>
      }
    </Grid>
  ); };

export default HeaderInfo;
