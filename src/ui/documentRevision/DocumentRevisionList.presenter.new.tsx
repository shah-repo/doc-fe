import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { SM } from '../../App';
import DocumentRevisionSidebarState from '../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.state';
import { GroupTag } from '../../state/ducks/auth/types';
import { Nullable } from '../../state/ducks/common/types';
import { STATUS_TYPES_LABEL } from '../../state/ducks/dashboard.new/my.feeds/types';
import { documentTypeSelectors } from '../../state/ducks/documentRevisions/documentType';
import { DocumentRevision, DocumentRevisionStatus } from '../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../state/reducers';
import { checkIsDocumentPO } from '../../ui/documentRevision/helpers/checkDocumentGroup';
import SummaryInfo from '../common/summary/SummaryInfo';
import DateFormatter from '../components/Date';
import Text from '../components/Text';
import { documentVersionPath } from '../document.revision/utils/paths';
import CustomLabelTooltip from '../hooks/docCustomization/CustomLabelTooltip';
import { useDocumentStatus } from '../hooks/docCustomization/useCustomization';
import useGetHasTag from '../hooks/useGetHasTag';
import { Translation } from '../translations/types';
import { styles } from './DocumentRevisionList.container.styles.new';
import { isDocumentRevisionDeprecated, isDocumentRevisionInDraft, isDocumentRevisionInStatus, isDocumentRevisionReleased } from './helpers/documentRevisionStatus';
import { generateRevisionNumber } from './helpers/generateRevisionNumber';
import { isDocumentAlphaReleased } from './helpers/revisionStage';

interface Props {
  documentRevision: DocumentRevision
  documentId: string
  selectedDocumentRevision: Nullable<string>
  docId: string
  documentTypeId?: string
  isDocumentPO: boolean
  isInlineApproval: boolean
  isRecord: boolean
  _documentRevisionSidebarState?: DocumentRevisionSidebarState
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
  _documentRevisionSidebarState,
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
  const isRecordOrPO = isRecord || isDocumentPO;

  const { status, displayStatus } = documentRevision;
  const { isVisible: isStatusVisible, tooltipConfig } = useDocumentStatus(documentTypeId, status);
  let verPrefix = 'common.revision';
  let recordDateLabel = 'common.updated' as Translation;

  const isSelected = selectedDocumentRevision === documentRevision.id;
  const isDraft = isDocumentRevisionInDraft(status);
  const isReleased = isDocumentRevisionReleased(status);
  const isDeprecated = isDocumentRevisionDeprecated(status);
  const isAlphaReleased =  isDocumentAlphaReleased(documentRevision.revisionStage);
  const isVoided = isDocumentRevisionInStatus([DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided], status);
  const documentType = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getDocumentTypeById(state, documentTypeId || ''));
  const isPO = checkIsDocumentPO(documentType?.groupOptions);

  if (isRecord) {
    if (isReleased) {
      recordDateLabel = 'document.revision.released.date';
    }
    if (isReleased || ((isDeprecated || isDraft) && isInlineApproval && isAlphaReleased)) {
      verPrefix = 'common.revision';
    }
    if (isVoided) {
      recordDateLabel = 'record.voided.date';
    }
  }

  const getDateValue = () => {
    if (isRecord) {
      if (isReleased) {
        return documentRevision.releasedAt;
      }
      if (isVoided) {
        return documentRevision.voidedAt;
      }
      if (isDeprecated) {
        return documentRevision.deprecatedAt;
      }
      return documentRevision.updatedAt;
    }

    return documentRevision.obsoletedAt || documentRevision.effectiveDate;
  };

  const docIdLabel = (isRecordOrPO ? 'common.id' : 'common.docId') as Translation;
  let recordOwnerLabel = 'common.owner' as Translation;

  if (isRecord && (isReleased || isVoided)) {
    recordOwnerLabel = isVoided ? 'record.voided.by' : 'record.released.by';
  }

  const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);

  return (
    <div
      key={documentRevision.id}
      className={_documentRevisionSidebarState?.open ? classNames(classes.linkContainer, {
        [classes.selected]: isSelected,
      }) : classes.container}
      data-cy="DocumentRevisionList-item"
    >
      <NavLink
        to={link}
        className={isSelected ? classes.activeLinkBox : classes.inActiveLinkBox}
        activeClassName={classes.activeLinkTitle}
      >
        <Typography
          component="span"
          data-cy="revision"
          className={
            isSelected ? classes.activeLinkBox : classes.inActiveLinkBox
          }
        >
          <Text message={verPrefix} />
          &nbsp;
          {versionNumber}
          {isStatusVisible && (
            <Typography data-cy="revision-status" variant="h6" component="span" className={classes.displayStatus}>
              <CustomLabelTooltip {...{ tooltipConfig }}>
                <>
                  &nbsp; - <Text message={isPO && isReleased ? SM.isNewVersion && isUserAdminEnforce
                    ? STATUS_TYPES_LABEL.EDIT : STATUS_TYPES_LABEL.APPROVED : displayStatus} />
                </>
              </CustomLabelTooltip>
            </Typography>
          )}
        </Typography>
      </NavLink>
      <NavLink
        to={link}
        key={documentRevision.id}
        className={
          isSelected ? classes.activeLinkBody : classes.inActiveLinkBody
        }
      >
        <SummaryInfo
          dataCy="common.docId"
          label={docIdLabel}
          value={docId}
        />
        {!isRecordOrPO && (
          <SummaryInfo label="common.title" value={documentRevision.name} />
        )}
        <SummaryInfo
          label={recordOwnerLabel}
          value={documentRevision.owner.user.name}
        />
        <SummaryInfo
          label={isRecord ? recordDateLabel : 'common.effective.date'}
          value={<DateFormatter value={getDateValue()} />}
        />
      </NavLink>
    </div>
  );
};

export default DocumentRevisionListPresenter;
