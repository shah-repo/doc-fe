import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { ChangeRequestStatus } from "../../../../state/ducks/changeRequest";
import { DocumentRevisionStatus, DocumentRevisionStatusAlias } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentStatus } from "../../../../state/ducks/documents";
import { FBDocTypeGroup } from "../../../form.builder";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";

export interface Props {
  status: string;
  id: string;
  name: string;
  documentTypeId?: string;
  revisionStage?: number;
  groupOptions?: DocumentGroupOptionsType[];
  isInlineApproval?: boolean;
}

export const HeaderInfo: React.FunctionComponent<Props> = ({
  status,
  name,
  id,
  documentTypeId,
  revisionStage,
  groupOptions,
  isInlineApproval,
}) => {
  const isDraft = status === DocumentStatus.Draft;
  const isAlphaReleased = revisionStage === 3;
  const isRecord = groupOptions?.includes(FBDocTypeGroup.RECORD);

  // we should rename enum for document types, it is not only for FB
  if ( isRecord && isInlineApproval && isDraft && !isAlphaReleased) {
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
    })} />;

  return (
    <Grid item xs={6} className={classes.itemWrap} >
      {
        isStatusVisible &&
        <Chip
          label={<Text message={statusLabel} />}
          id="HeaderInfo-status"
          data-cy="HeaderInfo-status"
          className={classNames(classes.statusDefault)}
          icon={statusIcon}
        />
      }
      <Typography variant="h6" id="HeaderInfo-docId" className={classes.id} component="span">
        {id}
      </Typography>
      {
        isTitleVisible &&
        <Typography variant="h6" id="HeaderInfo-name" component="span">
          {name}
        </Typography>
      }
    </Grid>
  );
};

export default HeaderInfo;
