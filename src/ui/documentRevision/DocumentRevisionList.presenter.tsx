import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import SummaryInfo from "../common/summary/SummaryInfo";
import DateFormatter from "../components/Date";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import CustomLabelTooltip from "../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus } from "../hooks/docCustomization/useCustomization";
import { Translation } from "../translations/types";
import { styles } from "./DocumentRevisionList.container.styles";
import { isDocumentRevisionDeprecated, isDocumentRevisionInDraft, isDocumentRevisionInStatus, isDocumentRevisionReleased } from "./helpers/documentRevisionStatus";
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

const DocumentRevisionListPresenter: React.FunctionComponent<Props> = ({
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

  const { status, displayStatus } = documentRevision;

  const { isVisible: isStatusVisible, tooltipConfig } = useDocumentStatus(documentTypeId, status);
  let verPrefix = "common.revision";
  let recordDateLabel = "common.updated" as Translation;

  const isSelected = selectedDocumentRevision === documentRevision.id;
  const isDraft = isDocumentRevisionInDraft(status);
  const isReleased = isDocumentRevisionReleased(status);
  const isDeprecated = isDocumentRevisionDeprecated(status);
  const isAlphaReleased =  isDocumentAlphaReleased(documentRevision.revisionStage);
  const isVoided = isDocumentRevisionInStatus([DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided], status);


  if (isRecord) {
    if (isReleased) {
      recordDateLabel = "document.revision.released.date";
    }
    if (isReleased || ((isDeprecated || isDraft) && isInlineApproval && isAlphaReleased)) {
      verPrefix = "common.revision";
    }
    if (isVoided) {
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
            <CustomLabelTooltip {...{ tooltipConfig }}>
              <>
              &nbsp; - <Text message={displayStatus} />
              </>
            </CustomLabelTooltip>
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
