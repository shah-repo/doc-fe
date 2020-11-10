import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType } from "../../../../state/ducks/documentRevisions/documentType";
import { checkIsDocumentRecord } from "../../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionCanceled, isDocumentRevisionDeprecated, isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionInStatus } from "../../../documentRevision/helpers/documentRevisionStatus";
import { isDocumentAlphaReleased, isDocumentNumericRelease } from "../../../documentRevision/helpers/revisionStage";
import { useDocumentStatus, useTitle } from "../../../hooks/docCustomization/useCustomization";
import Text from "../../Text";
import { styles } from "./HeaderInfo.styles";

export interface Props {
  status: string;
  id: string;
  name: string;
  revisionChangeType?: RevisionChangeType;
  subRevision?: number;
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
  revisionChangeType,
  subRevision,
}) => {
  const isDraft = isDocumentRevisionInDraft(status);
  const isAlphaReleased = isDocumentAlphaReleased(revisionStage);
  const isRecord = checkIsDocumentRecord(groupOptions);

  const [isStatusVisible, statusLabel] = useDocumentStatus(documentTypeId, status);
  let stateLabel = statusLabel;
  const [isTitleVisible] = useTitle(documentTypeId);
  const classes = styles();
  const isStatusReleased = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status as DocumentRevisionStatus,
  );
  const isStatusCanceled = isDocumentRevisionCanceled(status);
  const isDeprecated = isDocumentRevisionDeprecated(status);
  const isObsolete = revisionChangeType === RevisionChangeType.Obsolete;
  const isInReview = isDocumentRevisionInReview(status);
  const isVoided = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided],
    status as DocumentRevisionStatus
  );
  const isNumericRelease = isDocumentNumericRelease(revisionStage);

  const statusIcon =
    <div className={classNames(classes.statusIconDefault, {
      [classes.statusIconReleased]: isStatusReleased,
      [classes.statusIconCanceled]: isStatusCanceled,
    })} />;

  if (isRecord) {
    if (isStatusReleased) {
      stateLabel = "common.released";
    }
    if (!isInlineApproval && (!isObsolete || isInReview)) {
      stateLabel = status;
    }
    if (!isInlineApproval && isDeprecated) {
      stateLabel = "common.archived";
    }
    if (isDraft && subRevision === 0 && !isObsolete) {
      stateLabel = "common.wip";
    }
    if (isDeprecated && isInlineApproval && isAlphaReleased) {
      stateLabel = "common.archived";
    }
    if ((isDeprecated || isStatusReleased) && isInlineApproval && isNumericRelease) {
      stateLabel = "common.archived";
    }
    if (isVoided) {
      stateLabel = "common.voided";
    }
    if (isStatusReleased && isInlineApproval && isNumericRelease) {
      stateLabel = "common.last.signed";
    }
    if (isStatusCanceled) {
      stateLabel = "common.canceled";
    }
  }

  return (
    <Grid item xs={6} className={classes.itemWrap} >
      {
        isStatusVisible &&
        <Chip
          label={<Text message={stateLabel} />}
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
