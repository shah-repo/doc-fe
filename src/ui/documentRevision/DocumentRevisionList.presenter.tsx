import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from "../../state/ducks/documentRevisions";
import SummaryInfo from "../common/summary/SummaryInfo";
import DateFormatter from "../components/Date";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import { useDocumentStatus } from "../hooks/docCustomization/useCustomization";
import { Translation } from "../translations/types";
import { styles } from "./DocumentRevisionList.container.styles";
import { generateRevisionNumber } from "./helpers/generateRevisionNumber";
import { isDocumentAlphaReleased } from "./helpers/revisionStage";

interface Props {
  documentRevision: DocumentRevision;
  documentId: string;
  selectedDocumentRevision: Nullable<string>;
  docId: string;
  documentTypeId?: string;
  isDocumentPO: boolean;
  isInlineApproval: boolean;
  isRecord: boolean;
}

export const DocumentRevisionListPresenter: React.FunctionComponent<Props> = ({
  documentRevision,
  documentId,
  selectedDocumentRevision,
  docId,
  documentTypeId,
  isDocumentPO,
  isInlineApproval,
  isRecord,
}) => {
  const classes = styles();
  const link = documentVersionPath(
    documentRevision.id,
    documentId,
  );
  const versionNumber = generateRevisionNumber(
    documentRevision.revision,
    documentRevision.revisionStage,
    documentRevision.subRevision,
    documentRevision.revisionChangeType,
    undefined,
    isRecord,
  );

  const { status } = documentRevision;
  const [isStatusVisible, statusLabel] = useDocumentStatus(documentTypeId, status);
  let verPrefix = "common.revision";
  let stateLabel = statusLabel;
  let recordDateLabel = "common.updated" as Translation;

  const isSelected = selectedDocumentRevision === documentRevision.id;
  const isDraft = status === DocumentRevisionStatus.Draft;
  const isReleased = status === DocumentRevisionStatus.Released;
  const isDeprecated = status === DocumentRevisionStatus.Deprecated;
  const isAlphaReleased =  isDocumentAlphaReleased(documentRevision.revisionStage);
  const isNumericRelease = documentRevision.revisionStage === 1;
  const isObsolete = documentRevision.revisionChangeType === RevisionChangeType.Obsolete;
  const isInReview = status === DocumentRevisionStatus.InReview;
  const isVoided = status === DocumentRevisionStatus.Obsolete || status === DocumentRevisionStatus.Voided;


  if (isRecord) {
    if (isReleased) {
      recordDateLabel = "document.revision.released.date";
      stateLabel = "common.released";
    }
    if (!isInlineApproval && (!isObsolete || isInReview)) {
      stateLabel = status;
    }
    if (!isInlineApproval && isDeprecated) {
      stateLabel = "common.archived";
    }
    if (isDraft && documentRevision.subRevision === 0 && !isObsolete) {
      stateLabel = "common.wip";
    }
    if (isReleased || ((isDeprecated || isDraft) && isInlineApproval && isAlphaReleased)) {
      verPrefix = "common.revision";
    }
    if (isDeprecated && isInlineApproval && isAlphaReleased) {
      stateLabel = "common.archived";
    }
    if ((isDeprecated || isReleased) && isInlineApproval && isNumericRelease) {
      stateLabel = "common.archived";
    }
    if (isReleased && isInlineApproval && isNumericRelease) {
      stateLabel = "common.last.signed";
    }
    if (isVoided) {
      stateLabel = "common.voided";
      recordDateLabel = "record.voided.date";
    }
  }

  const docIdLabel = (isRecord ? "common.id" : "common.docId") as Translation;
  const recordOwnerLabel = isVoided ? "record.voided.by" : "record.released.by";

  return (
    <div
      key={documentRevision.id}
      className={classNames(classes.linkContainer, {
        [classes.selected]: isSelected,
      })}
      data-cy={"DocumentRevisionList-item"}
    >
      <NavLink
        to={link}
        className={classes.linkTitle}
        activeClassName={classes.activeLinkTitle}
      >
        <div>
          <Text message={verPrefix} />
          &nbsp;
          {versionNumber}
          {
            isStatusVisible &&
            <>
              &nbsp; - <Text message={stateLabel} />
            </>
          }
        </div>
      </NavLink>
      <NavLink
        to={link}
        key={documentRevision.id}
        className={classes.linkBody}
      >
        <SummaryInfo
          dataCy={"common.docId"}
          label={isDocumentPO ? undefined : docIdLabel}
          value={docId}
        />
        {!isRecord && (
          <SummaryInfo
            label="common.title"
            value={documentRevision.name}
          />
        )}
        <SummaryInfo
          label={isRecord && (isReleased || isVoided) ? recordOwnerLabel : "common.owner"}
          value={documentRevision.owner.user.name}
        />
        <SummaryInfo
          label={isRecord ? recordDateLabel : "common.effective.date"}
          value={
            <DateFormatter
              value={
                isRecord ?
                  documentRevision.releasedAt || documentRevision.updatedAt :
                  documentRevision.obsoletedAt || documentRevision.effectiveDate
              }/>
          }
        />
      </NavLink>
    </div>
  );
};

export default DocumentRevisionListPresenter;
