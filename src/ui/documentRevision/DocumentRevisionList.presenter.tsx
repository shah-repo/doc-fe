import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import SummaryInfo from "../common/summary/SummaryInfo";
import DateFormatter from "../components/Date";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import { useDocumentStatus } from "../hooks/docCustomization/useCustomization";
import { Translation } from "../translations/types";
import { styles } from "./DocumentRevisionList.container.styles";
import { generateVersionNumber } from "./helpers";

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
  const versionNumber = generateVersionNumber(
    documentRevision.revision,
    documentRevision.revisionStage,
    documentRevision.subRevision,
    documentRevision.revisionChangeType,
  );

  const { status } = documentRevision;
  const [isStatusVisible, statusLabel] = useDocumentStatus(documentTypeId, status);
  let verPrefix = "common.revision";
  let stateLabel = statusLabel;

  const isSelected = selectedDocumentRevision === documentRevision.id;
  const isDraft = status === DocumentRevisionStatus.Draft;
  const isReleased = status === DocumentRevisionStatus.Released;
  const isDeprecated = status === DocumentRevisionStatus.Deprecated;
  const isAlphaReleased = documentRevision.revisionStage === 3;
  const isNumericRelease = documentRevision.revisionStage === 1;
  const isVoided = status === DocumentRevisionStatus.Obsolete || status === DocumentRevisionStatus.Voided;

  if (isDraft && isRecord && isInlineApproval && !isAlphaReleased) {
    stateLabel = "common.wip";
  }
  if (isReleased || ((isDeprecated || isDraft) && isInlineApproval && isRecord && isAlphaReleased)) {
    verPrefix = "common.revision";
  }
  if (isDeprecated && isInlineApproval && isRecord && isAlphaReleased) {
    stateLabel = "common.archived";
  }
  if ((isDeprecated || isReleased) && isInlineApproval && isNumericRelease) {
    stateLabel = "common.archived";
  }
  if (isReleased && isInlineApproval && isNumericRelease) {
    stateLabel = "common.last.signed";
  }
  if (isRecord && !isInlineApproval && !isDeprecated) {
    stateLabel = status;
  }


  const docIdLabel = (isRecord ? "common.id" : "common.docId") as Translation;
  const recordOwnerLabel = (isVoided ? "record.voided.by" : "record.released.by") as Translation;
  const recordDateLabel = (isVoided ? "record.voided.date" : "document.revision.released.date") as Translation;

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
          label={isRecord ? recordOwnerLabel : "common.owner"}
          value={documentRevision.owner.user.name}
        />
        <SummaryInfo
          label={isRecord ? recordDateLabel : "common.effective.date"}
          value={
            <DateFormatter
              value={documentRevision.obsoletedAt || documentRevision.effectiveDate}
            />
          }
        />
      </NavLink>
    </div>
  );
};

export default DocumentRevisionListPresenter;
