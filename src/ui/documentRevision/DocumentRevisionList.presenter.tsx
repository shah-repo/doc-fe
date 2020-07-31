import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import SummaryInfo from "../common/summary/SummaryInfo";
import Date from "../components/Date";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import { FBDocTypeGroup } from "../form.builder";
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
}

export const DocumentRevisionListPresenter: React.FunctionComponent<Props> = ({
  documentRevision,
  documentId,
  selectedDocumentRevision,
  docId,
  documentTypeId,
  isDocumentPO,
  isInlineApproval,
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
  const isSelected = selectedDocumentRevision === documentRevision.id;
  const { status } = documentRevision;
  const [isStatusVisible, statusLabel] = useDocumentVersion(documentTypeId, status);
  let verPrefix = "common.version";
  let statLabel = statusLabel;


  if (documentRevision.revision === 1 &&
    documentRevision.document?.documentType.groupOptions?.includes(FBDocTypeGroup.RECORD) && isInlineApproval) {
    verPrefix = "common.work.in.progress";
  }
  if (status === DocumentRevisionStatus.Released) {
    verPrefix = "common.revision";
  }
  if ((status === DocumentRevisionStatus.Released || status === DocumentRevisionStatus.Deprecated) &&
  isInlineApproval) {
    statLabel = "common.archived";
  }
  return (
    <div
      key={documentRevision.id}
      className={classNames(classes.linkContainer, {
        [classes.selected]: isSelected,
      })}
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
