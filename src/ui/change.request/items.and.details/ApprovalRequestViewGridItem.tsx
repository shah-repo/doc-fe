import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { DOC_TYPE_GROUP } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from '../../../state/ducks/documentRevisions/types';
import { RELATED_PARTS_ROOT_URL } from '../../../state/ducks/relatedParts/constants';
import { RelatedPartsListItem, RELATED_PARTS_STATUS } from '../../../state/ducks/relatedParts/types';
import { FBAutocompleteAsyncOption } from '../../form.builder';
import { FBEndpoint } from '../../form.builder/defaults/FBEndpoint';
import FBRequest from '../../form.builder/FBApi/FBApi.request';
import useStyles from './ApprovalRequestGrid.styles';
import { generateDocTitleText } from './helpers';
import { ApprovalRequestGridItem, FBDocumentRevisionResponse } from './ItemsAndDetails.types';

import { Link } from 'react-router-dom';
import { documentVersionPath } from '../../document.revision/utils/paths';

import InfoIcon from '@material-ui/icons/Info';

const ApprovalRequestViewGridItem: React.FunctionComponent<{
  entry: ApprovalRequestGridItem
  editItem: () => void
  handleRemove: (docRevId: string) => void
  viewItemActionsVisible: boolean
}> = ({
  entry,
  editItem,
  handleRemove,
  viewItemActionsVisible,
}) => {
  const classes = useStyles();

  const {
    docRevId, documentId, titleText, displayRevision, isPart, justificationOfChange, descriptionOfChange,
  } = entry;

  const [docTitle, setDocTitle] = useState(titleText);
  const [docRevDocumentId, setDocRevDocumentId] = useState(documentId);
  const [docRelatedParts, setDocRelatedParts]
    = useState<{revId: string, titleText: string, documentId: string, revisionChangeType?: RevisionChangeType}[]>([]);
  const [isExpanded, setExpanded] = useState(false);

  const documentDetailsApi: FBRequest<DocumentRevision, null> = new FBRequest();
  documentDetailsApi.setUrl({
    url: FBEndpoint.FetchAutocompleteValue,
    values: { id: docRevId, optionId: FBAutocompleteAsyncOption.DRAFTdocumentRevisions },
  });

  const getRelatedParts = async (documentRevisionId, displayRevision) => {
    // get the related parts for this document.
    documentDetailsApi.setUrl(`${RELATED_PARTS_ROOT_URL}/${documentRevisionId}`);
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
      if (document.documentType?.group === DOC_TYPE_GROUP.PART) {
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

  return (
    <div onClick={() => viewItemActionsVisible && editItem()}
      className={cx(classes.enclosingDiv, classes.enclosingDivViewItem, {
        [classes.enclosingDivOpened]: isExpanded,
      })}
      data-cy="enclosing-div-view-item">
      <div className={classes.itemRow}>
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
            <span>{docTitle}</span>
          </Link>
          }
        </div>
        <div className={cx(classes.cellOther, classes.itemLeftPadding)}>
          <span>{descriptionOfChange}</span>
        </div>
        <div className={cx(classes.cellOther, classes.itemLeftPadding)}>
          <span>{justificationOfChange}</span>
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
                  >
                    {part.titleText}
                  </Link>
                  {
                    part.revisionChangeType === RevisionChangeType.Obsolete
                     && <InfoIcon color="secondary" />
                  }
                </li>
              ))
            }
          </ul>
        </div>
      }
    </div>
  );
};

export default ApprovalRequestViewGridItem;
