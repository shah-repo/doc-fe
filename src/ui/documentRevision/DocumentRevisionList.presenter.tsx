import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { Nullable } from "../../state/ducks/common";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
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
}

export const DocumentRevisionListPresenter: React.FunctionComponent<Props> = ({
  documentRevision,
  documentId,
  selectedDocumentRevision,
  docId,
  documentTypeId,
  isDocumentPO,
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
          <Text translation="common.version" />
          &nbsp;
          {versionNumber}
          {
            isStatusVisible &&
            <>
              &nbsp; - <Text message={statusLabel} />
            </>
          }
        </div>
      </NavLink>
      <NavLink
        to={link}
        key={documentRevision.id}
        className={classes.linkBody}
      >
        <SummaryInfo label={isDocumentPO ? undefined : "common.docId"} value={docId} />
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
