import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import SummaryInfo from "../common/summary/SummaryInfo";
import Date from "../components/Date";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import { useDocumentVersion } from "../hooks/docCustomization/useCustomization";
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
  const [isStatusVisible, statusLabel] = useDocumentVersion(documentTypeId, status);
  let verPrefix = "common.revision";
  let statLabel = statusLabel;

  const isSelected = selectedDocumentRevision === documentRevision.id;
  const isDraft = status === DocumentRevisionStatus.Draft;
  const isReleased = status === DocumentRevisionStatus.Released;
  const isDeprecated = status === DocumentRevisionStatus.Deprecated;
  const isAlphaReleased = documentRevision.revisionStage === 3;
  const isNumericRelease = documentRevision.revisionStage === 1;

  if (isDraft && isRecord && isInlineApproval && !isAlphaReleased) {
    verPrefix = "common.work.in.progress";
  }
  if (isReleased || ((isDeprecated || isDraft) && isInlineApproval && isRecord && isAlphaReleased)) {
    verPrefix = "common.revision";
  }
  if (isDeprecated && isInlineApproval && isRecord && isAlphaReleased) {
    statLabel = "common.archived";
  }
  if ((isDeprecated || isReleased) && isInlineApproval && isNumericRelease) {
    statLabel = "common.archived";
  }

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
              &nbsp; - <Text message={statLabel} />
            </>
          }
        </div>
      </NavLink>
      <NavLink
        to={link}
        key={documentRevision.id}
        className={classes.linkBody}
      >
        <SummaryInfo dataCy={"common.docId"} label={isDocumentPO ? undefined : "common.docId"} value={docId} />
        <SummaryInfo
          label="common.title"
          value={documentRevision.name}
        />
        <SummaryInfo
          label="common.owner"
          value={documentRevision.owner.user.name}
        />
        <SummaryInfo
          label="common.effective.date"
          value={
            <Date
              value={documentRevision.obsoletedAt || documentRevision.effectiveDate}
            />
          }
        />
      </NavLink>
    </div>
  );
};

export default DocumentRevisionListPresenter;
