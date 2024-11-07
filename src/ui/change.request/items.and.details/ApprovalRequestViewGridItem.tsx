import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React, { MouseEvent, MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { DOC_TYPE_GROUP } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from '../../../state/ducks/documentRevisions/types';
import { RELATED_PARTS_ROOT_URL } from '../../../state/ducks/relatedParts/constants';
import { RELATED_PARTS_STATUS, RelatedPartsListItem } from '../../../state/ducks/relatedParts/types';
import { Checkbox, IconButton } from '../../components/forms/fields-next';
import { toastError } from '../../components/notifications';
import OverflowTooltip from '../../components/OverflowTooltip';
import WhereUsedDialog, { WhereUsedType } from '../../components/whereUsed/WhereUsedDialog';
import { documentVersionPath } from '../../document.revision/utils/paths';
import { FBAutocompleteAsyncOption } from '../../form.builder';
import { FBEndpoint } from '../../form.builder/defaults/FBEndpoint';
import FBRequest from '../../form.builder/FBApi/FBApi.request';
import useDialog from '../../hooks/useDialog';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './ApprovalRequestGrid.styles';
import ARAttachmentsList from './ARAttachmentsList';
import { generateDocTitleText } from './helpers';
import { ApprovalRequestGridItem, FBDocumentRevisionResponse } from './ItemsAndDetails.types';

interface IDocRelatedPart {
  revId: string
  titleText: string
  documentId: string
  revisionChangeType?: RevisionChangeType
  whereUsedCount: number
}

interface TooltipProps {
  'data-cy': string
  tooltipClassName: string
}

const TextTooltip: React.FC<TooltipProps> = ({ children, tooltipClassName, ...props }) => (
  <OverflowTooltip
    arrow
    interactive
    placement="top"
    title={<div className={cx('containing-box-scrollbar', tooltipClassName)}>{children}</div>}
    maxLines={4}
    {...props}
  >
    {children}
  </OverflowTooltip>
);

interface Props {
  entry: ApprovalRequestGridItem
  editItem: () => void
  handleRemove: (docRevId: string) => void
  viewItemActionsVisible: boolean
  isLineItemPartCanBeSubstituted?: boolean
}

const ApprovalRequestViewGridItem: React.FC<Props> = ({
  entry,
  editItem,
  viewItemActionsVisible,
  isLineItemPartCanBeSubstituted,
}) => {
  const classes = useStyles();

  const {
    docRevId, documentId, titleText, displayRevision, isPart, justificationOfChange, descriptionOfChange, autoUpdate, revisionFormTo, attachments, whereUsedView,
  } = entry;
  const isWhereUsedTreeExist = (whereUsedView ?? []).length > 1;
  const [docTitle, setDocTitle] = useState(titleText);
  const [docRevDocumentId, setDocRevDocumentId] = useState(documentId);
  const [docRelatedParts, setDocRelatedParts] = useState<IDocRelatedPart[]>([]);
  const [isExpanded, setExpanded] = useState(false);
  const [whereUsedDocRevId, setWhereUsedDocRevId] = useState(docRevId);
  const documentDetailsApi: FBRequest<DocumentRevision, null> = useMemo(() => new FBRequest(), []);

  documentDetailsApi.setUrl({
    url: FBEndpoint.FetchAutocompleteValue,
    values: { id: docRevId, optionId: FBAutocompleteAsyncOption.DRAFTdocumentRevisions },
  });

  const getRelatedParts = useCallback(async (documentRevisionId: string, displayRevision: string) => {
    documentDetailsApi.setUrl(`${RELATED_PARTS_ROOT_URL}/${documentRevisionId}?isGetWhereUsedStatus=true`);
    const relatedPartsResponse = await documentDetailsApi.fetch() as RelatedPartsListItem[];
    if (relatedPartsResponse.length > 0) {
      const childrenDetails = relatedPartsResponse
        .filter(part => ![DocumentRevisionStatus.Voided, DocumentRevisionStatus.Obsolete].includes(part.status))
        .filter(part => part.relatedStatus !== RELATED_PARTS_STATUS.RELATED_SEPARATE)
        .map(part => ({
          revId: part.documentRevisionId,
          documentId: part.documentId,
          titleText: generateDocTitleText(part.rootDocId, displayRevision, part.name),
          revisionChangeType: part.revisionChangeType,
          revisionFormTo: part.revisionFormTo,
          whereUsedCount: part.whereUsedCount,
        }));
      setDocRelatedParts(childrenDetails);
    }
  }, [documentDetailsApi]);

  const getDocumentDetails = useCallback(async () => {
    if (!documentId) {
      const { document, displayRevision, name } = await documentDetailsApi.fetch() as FBDocumentRevisionResponse;
      const documentTitleText = generateDocTitleText(document.docId, displayRevision, name);
      setDocTitle(documentTitleText);
      setDocRevDocumentId(document.id);
      if ([DOC_TYPE_GROUP.PART, DOC_TYPE_GROUP.OTHER].includes(document.documentType?.group)) {
        await getRelatedParts(docRevId, displayRevision);
      }
    } else {
      if (isPart) {
        await getRelatedParts(docRevId, displayRevision);
      }
    }
  }, [displayRevision, docRevId, documentDetailsApi, documentId, getRelatedParts, isPart]);

  useEffect(() => {
    getDocumentDetails().catch(toastError);
  }, [getDocumentDetails]);

  const toggleItem: MouseEventHandler = (event) => {
    event.stopPropagation();
    setExpanded(!isExpanded);
  };

  const whereUsedDialog = useDialog();
  const openWhereUsedDialog = (e: MouseEvent, docRevId?: string) => {
    e.stopPropagation();
    if (docRevId) {
      setWhereUsedDocRevId(docRevId);
    }
    whereUsedDialog.open();
  };
  const closeWhereUsedDialog: MouseEventHandler = (e) => {
    whereUsedDialog.close();
    e.stopPropagation();
  };

  const hasRelatedParts = docRelatedParts.length > 0;

  const blockEditing = (e: MouseEvent) => e.stopPropagation();

  return (
    <>
      <div
        onClick={() => viewItemActionsVisible && editItem()}
        className={cx(
          classes.enclosingDiv,
          classes.enclosingDivViewItem,
        )}
        data-cy="enclosing-div-view-item"
      >
        <div
          className={classes.contentRow}
          data-cy="ar-item-view-row"
        >
          {isLineItemPartCanBeSubstituted && (
            <div className={cx(classes.contentCell, classes.autoUpdateCell)}>
              <Checkbox
                checked={Boolean(autoUpdate)}
                name="autoUpdate"
                disabled
              />
            </div>
          )}
          <div className={cx(classes.contentCell, classes.itemCell)}>
            {hasRelatedParts && (
              <IconButton
                kind="secondary"
                size="small"
                iconSize={12}
                className={cx(classes.expandIcon, { [classes.expandIconExpanded]: isExpanded })}
                onClick={toggleItem}
              >
                <FontAwesomeIcon icon={regular('chevron-right')} />
              </IconButton>
            )}
            {docRevDocumentId && (
              <Link
                to={documentVersionPath(docRevId, docRevDocumentId)}
                target="_blank"
                className={classes.link}
                onClick={blockEditing}
              >
                <span data-cy="view-document">{docTitle}</span>
              </Link>
            )}
          </div>
          <div className={classes.contentCell}>
            <span data-cy="view-rev-from-to">{revisionFormTo}</span>
          </div>
          <div className={classes.contentCell}>
            <ARAttachmentsList
              attachments={attachments}
              titleId={docTitle}
            />
          </div>
          <div className={cx(classes.contentCell, classes.textCell)}>
            <TextTooltip
              tooltipClassName={classes.tooltipContent}
              data-cy="view-description-of-change"
            >
              {descriptionOfChange}
            </TextTooltip>
          </div>
          <div className={cx(classes.contentCell, classes.textCell)}>
            <TextTooltip
              data-cy="view-justification-of-change"
              tooltipClassName={classes.tooltipContent}
            >
              {justificationOfChange}
            </TextTooltip>
          </div>
          <div className={cx(classes.contentCell, classes.whereUsedCell)}>
            <FontAwesomeIcon
              icon={isWhereUsedTreeExist ? solid('circle') : regular('circle')}
              data-cy="view-where-used"
              onClick={e => isWhereUsedTreeExist && openWhereUsedDialog(e)}
              className={classes.whereUsedIcon}
            />
          </div>
        </div>
        {hasRelatedParts && isExpanded && (
          <>
            <h4
              className={cx(
                classes.moreDetailsHeader,
                {
                  [classes.moreDetailsHeaderSubstituted]: isLineItemPartCanBeSubstituted,
                },
              )}
            >
              {translate('form.builder.related.parts')}
            </h4>
            <div className={classes.moreDetails}>
              {docRelatedParts.map((part) => (
                <div key={part.revId} className={cx(classes.contentRow, classes.contentSubRow)}>
                  <div
                    className={cx(
                      classes.contentSubCell,
                      classes.itemCell,
                      {
                        [classes.subItemCellSubstituted]: isLineItemPartCanBeSubstituted,
                      },
                    )}
                  >
                    <Link
                      to={documentVersionPath(part.revId, part.documentId)}
                      target="_blank"
                      className={classes.link}
                      onClick={blockEditing}
                    >
                      {part.titleText}
                    </Link>
                  </div>
                  <div className={cx(classes.contentSubCell, classes.subObsoleteCell)}>
                    {part.revisionChangeType === RevisionChangeType.Obsolete && (
                      <FontAwesomeIcon icon={solid('info-circle')} className={classes.obsoleteIcon} />
                    )}
                  </div>
                  <div className={cx(classes.contentSubCell, classes.whereUsedCell)}>
                    <FontAwesomeIcon
                      icon={part.whereUsedCount ? solid('circle') : regular('circle')}
                      data-cy="view-where-used"
                      onClick={e => part.whereUsedCount > 0 && openWhereUsedDialog(e, part.revId)}
                      className={classes.whereUsedIcon}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {whereUsedDialog.isOpen && (
        <WhereUsedDialog
          revId={whereUsedDocRevId}
          whereUsedDialog={whereUsedDialog}
          closeDialog={closeWhereUsedDialog}
          type={WhereUsedType.PART}
        />
      )}
    </>
  );
};

export default withThemeNext(ApprovalRequestViewGridItem);
