import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InfoIcon from '@material-ui/icons/Info';
import cx from 'classnames';
import React, { MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { DOC_TYPE_GROUP } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from '../../../state/ducks/documentRevisions/types';
import { RELATED_PARTS_ROOT_URL } from '../../../state/ducks/relatedParts/constants';
import { RELATED_PARTS_STATUS, RelatedPartsListItem } from '../../../state/ducks/relatedParts/types';
import Tooltip from '../../components/common/kendo/Tooltip';
import { Button } from '../../components/forms/fields-next';
import WhereUsedDialog, { WhereUsedType } from '../../components/whereUsed/WhereUsedDialog';
import { documentVersionPath } from '../../document.revision/utils/paths';
import { FB, FBAutocompleteAsyncOption, FBFileUploadState, FBProvider } from '../../form.builder';
import { FBEndpoint } from '../../form.builder/defaults/FBEndpoint';
import FBRequest from '../../form.builder/FBApi/FBApi.request';
import useDialog from '../../hooks/useDialog';
import FBAttachmentNamePresenter from '../FBMaterialDisposition/components/FBTasksListTable/components/FBAttachmentNamePresenter';
import useStyles from './ApprovalRequestGrid.styles';
import { generateDocTitleText } from './helpers';
import { ApprovalRequestGridItem, FBDocumentRevisionResponse } from './ItemsAndDetails.types';

interface IDocRelatedPart {
  revId: string
  titleText: string
  documentId: string
  revisionChangeType?: RevisionChangeType
  whereUsedCount: number
}

const ApprovalRequestViewGridItem: React.FunctionComponent<{
  entry: ApprovalRequestGridItem
  editItem: () => void
  handleRemove: (docRevId: string) => void
  viewItemActionsVisible: boolean
  isLineItemPartCanBeSubstituted?: boolean
}> = ({
  entry,
  editItem,
  handleRemove,
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

  const documentDetailsApi: FBRequest<DocumentRevision, null> = new FBRequest();
  documentDetailsApi.setUrl({
    url: FBEndpoint.FetchAutocompleteValue,
    values: { id: docRevId, optionId: FBAutocompleteAsyncOption.DRAFTdocumentRevisions },
  });

  const getRelatedParts = async (documentRevisionId, displayRevision) => {
    // get the related parts for this document.
    documentDetailsApi.setUrl(`${RELATED_PARTS_ROOT_URL}/${documentRevisionId}?isGetWhereUsedStatus=true`);
    const relatedPartsResponse: RelatedPartsListItem[] = await documentDetailsApi.fetch();
    if (relatedPartsResponse.length > 0) {
      const childrenDetails = relatedPartsResponse
        .filter((part: RelatedPartsListItem) =>
          ![DocumentRevisionStatus.Voided, DocumentRevisionStatus.Obsolete].includes(part.status))
        .filter((part: RelatedPartsListItem) => part.relatedStatus !== RELATED_PARTS_STATUS.RELATED_SEPARATE)
        .map((part: RelatedPartsListItem) => (
          {
            revId: part.documentRevisionId,
            documentId: part.documentId,
            titleText: generateDocTitleText(part.rootDocId, displayRevision, part.name),
            revisionChangeType: part.revisionChangeType,
            revisionFormTo: part.revisionFormTo,
            attchments: part.attachments,
            whereUsedCount: part.whereUsedCount,
          }
        ));
      setDocRelatedParts(childrenDetails);
    }
  };

  const getDocumentDetails = async () => {
    if (!documentId) {
      const {
        document, displayRevision, name,
      }: FBDocumentRevisionResponse = await documentDetailsApi.fetch();
      const documentTitleText = generateDocTitleText(document.docId, displayRevision, name);
      setDocTitle(documentTitleText);
      setDocRevDocumentId(document.id);
      if ([DOC_TYPE_GROUP.PART, DOC_TYPE_GROUP.OTHER].includes(document.documentType?.group)) {
        getRelatedParts(docRevId, displayRevision);
      }
    } else {
      if (isPart) {
        getRelatedParts(docRevId, displayRevision);
      }
    }
  };

  useEffect(() => {
    getDocumentDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleItem = (event) => {
    event.stopPropagation();
    setExpanded(!isExpanded);
  };

  const getTableElementData = (data, dataCy) => {
    return <Typography component="p" data-cy={`view-${dataCy}`} className={`${classes.truncate}`}>{data}</Typography>;
  };

  const getTableItemElementData = () => {
    return <span data-cy="document">{docTitle.replace(/(Rev [0-9A-Z.]*)(.*)/, '$1')}</span>;
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
  const intl = useIntl();
  const MAX_VISIBLE_ATTACHMENTS = 3;
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll((prevState) => !prevState);
  const viewMore = intl.formatMessage({ id: 'document.revision.view.more' });
  const viewLess = intl.formatMessage({ id: 'document.revision.view.less' });

  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
  const sortedAttachments = (attachments || []).sort((a, b) => {
    if (a.lineType === 'RED_LINE' && b.lineType !== 'RED_LINE') return -1;
    if (a.lineType !== 'RED_LINE' && b.lineType === 'RED_LINE') return 1;
    return 0;
  });

  const visibleAttachments = showAll ? sortedAttachments : sortedAttachments.slice(0, MAX_VISIBLE_ATTACHMENTS);

  return (
    <div onClick={() => viewItemActionsVisible && editItem()}
      className={cx(classes.enclosingDiv, classes.enclosingDivViewItem, {
        [classes.enclosingDivOpened]: isExpanded,
      })}
      data-cy="enclosing-div-view-item">
      <div className={classes.itemRow} data-cy="ar-item-view-row">
        {isLineItemPartCanBeSubstituted && <div className={cx(classes.cellautoUpdate, classes.hiddenLegend)}>
          <FormControlLabel
            color="primary"
            control={
              <MuiCheckbox
                checked={Boolean(autoUpdate)}
                name="autoUpdate"
                color="primary"
                disabled={true}
              />
            }
            label=""
          />
        </div> }
        <div className={classes.cellOne}>
          {
            docRelatedParts.length > 0
            && <span className={cx(classes.iconClass, 'iconClass')} onClick={toggleItem}>
              <ChevronRightIcon fontSize="small" className={classes.showMoreIcon} />
            </span>
          }
          { docRevDocumentId && <Link
            to={documentVersionPath(docRevId, docRevDocumentId)}
            target="_blank"
            className={classes.link}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Tooltip customTooltipClass={classes.tooltipBox} showTooltip={true} data={docTitle} childrenElement={getTableItemElementData()} />
          </Link>
          }
        </div>
        <div className={cx(classes.cellRev, classes.itemLeftPadding)}>
          <Tooltip customTooltipClass={classes.tooltipBox} showTooltip={true} data={revisionFormTo as string} childrenElement={getTableElementData(revisionFormTo, 'rev-from-to')} />
        </div>
        <div className={cx(classes.cellRev, classes.itemLeftPadding)}>
          <FBProvider {...{ fileUploadState }}>
            <div className={classes.attachmentsList}>
              {visibleAttachments?.map((attachment) => (
                <FBAttachmentNamePresenter
                  key={attachment.id}
                  boxProps={{ className: classes.attachmentsContainer }}
                  attachments={[attachment]}
                  fileUploadState={fileUploadState}
                  isDisabled={true}
                />
              ))}
            </div>

            {/* Show More or Less button if attachments exceed the limit */}
            {visibleAttachments.length > MAX_VISIBLE_ATTACHMENTS ? (
              <Button
                variant="text"
                onClick={toggleShowAll}
                className={classes.moreOrLess}>
                {viewLess}
              </Button>
            ) : (
              <Button
                variant="text"
                onClick={toggleShowAll}
                className={classes.moreOrLess}>
                {`...${viewMore}`}
              </Button>
            )}
          </FBProvider>
        </div>
        <div className={cx(isLineItemPartCanBeSubstituted ? classes.smallCellOther : classes.cellOther, classes.itemLeftPadding)}>
          <Tooltip customTooltipClass={classes.tooltipBox} showTooltip={true} data={descriptionOfChange} childrenElement={getTableElementData(descriptionOfChange, 'description-of-change')} />
        </div>
        <div className={cx(isLineItemPartCanBeSubstituted ? classes.smallCellOther : classes.cellOther, classes.itemLeftPadding)}>
          <Tooltip customTooltipClass={classes.tooltipBox} showTooltip={true} data={justificationOfChange} childrenElement={getTableElementData(justificationOfChange, 'justification-of-change')} />
        </div>
        <div className={cx(classes.cellWhereUsed, classes.itemLeftPadding)}>
          <FontAwesomeIcon icon={isWhereUsedTreeExist ? solid('circle') : regular('circle')} data-cy="view-where-used"
            onClick={e => isWhereUsedTreeExist && openWhereUsedDialog(e)} className={classes.dot} />
        </div>
      </div>
      {
        docRelatedParts.length > 0 && isExpanded
        && <div className={cx(classes.moreDetails, classes.fullWidth)}>
          <hr className={classes.separator} />
          <h4 className={classes.moreDetailsHeader}>Related Parts</h4>
          <ul className={classes.docList}>
            {
              docRelatedParts.map((part) => (
                <li key={part.revId} className={classes.docListItem}>
                  <Link
                    to={documentVersionPath(part.revId, part.documentId)}
                    target="_blank"
                    className={classes.link}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  > {part.titleText}
                  </Link>
                  {
                    part.revisionChangeType === RevisionChangeType.Obsolete
                     && <InfoIcon color="secondary" />
                  }
                  <FontAwesomeIcon icon={part.whereUsedCount ? solid('circle') : regular('circle')} data-cy="view-where-used"
                    onClick={e => part.whereUsedCount > 0 && openWhereUsedDialog(e, part.revId)} className={classes.dot} />
                </li>
              ))
            }
          </ul>
        </div>
      }
      {
        whereUsedDialog.isOpen
        && <WhereUsedDialog
          revId={whereUsedDocRevId}
          whereUsedDialog={whereUsedDialog}
          closeDialog = {closeWhereUsedDialog}
          type={WhereUsedType.PART}
        />
      }
    </div>
  );
};

export default ApprovalRequestViewGridItem;
