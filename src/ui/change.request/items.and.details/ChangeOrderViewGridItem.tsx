/* eslint-disable no-console */
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { RELATED_PARTS_ROOT_URL } from "../../../state/ducks/relatedParts/constants";
import { RelatedPartsListItem } from "../../../state/ducks/relatedParts/types";
import { FBAutocompleteAsyncOption } from "../../form.builder";
import { FBEndpoint } from "../../form.builder/defaults/FBEndpoint";
import FBRequest from "../../form.builder/FBApi/FBApi.request";
import useStyles from "./ChangeOrderGrid.styles";
import { generateDocTitleText } from "./helpers";
import { ChangeOrderGridItem, FBDocumentRevisionResponse } from "./ItemsAndDetails.types";

import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const ChangeOrderViewGridItem: React.FunctionComponent<{
  entry: ChangeOrderGridItem;
  editItem: () => void;
}> = ({
  entry,
  editItem,
}) => {
  const classes = useStyles();
  const {
    docRevId, documentId, titleText, displayRevision, id, isPart, justificationOfChange, descriptionOfChange,
  } = entry;

  console.log(docRevId,
    titleText,
    id,
    isPart,
    justificationOfChange,
    descriptionOfChange);

  const [docTitle, setDocTitle] = useState(titleText);
  const [docRelatedParts, setDocRelatedParts] = useState<{revId: string; titleText: string}[]>([]);
  const [expanded, setExpanded] = useState(false);

  const documentDetailsApi: FBRequest<DocumentRevision, null> = new FBRequest();
  documentDetailsApi.setUrl({
    url: FBEndpoint.FetchAutocompleteValue,
    values: { id, optionId: FBAutocompleteAsyncOption.DRAFTdocumentRevisions },
  });


  const getRelatedParts = async (documentId, displayRevision) => {
    // get the related parts for this document.
    documentDetailsApi.setUrl(`${RELATED_PARTS_ROOT_URL}/${documentId}`);
    const relatedPartsResponse: RelatedPartsListItem[] = await documentDetailsApi.fetch();
    if (relatedPartsResponse.length > 0) {
      const childrenDetails = relatedPartsResponse.map((part: RelatedPartsListItem) => (
        {
          revId: part.documentRevisionId,
          titleText: generateDocTitleText(part.rootDocId, displayRevision, part.name),
        }
      ));
      console.log(childrenDetails);
      setDocRelatedParts(childrenDetails);
    }
  };


  const getDocumentDetails = async () => {
    if (!documentId) {
      const {
        docId, group, documentId, displayRevision, name,
      }: FBDocumentRevisionResponse = await documentDetailsApi.fetch();
      const documentTitleText = generateDocTitleText(docId, displayRevision, name);
      setDocTitle(documentTitleText);
      if (group === DOC_TYPE_GROUP.PART) {
        getRelatedParts(documentId, displayRevision);
      }
    } else {
      if (isPart) {
        getRelatedParts(documentId, displayRevision);
      }
    }
  };

  useEffect(() => {
    getDocumentDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleItem = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={cx(classes.enclosingDiv, classes.enclosingDivViewItem, {
      [classes.enclosingDivOpened]: expanded,
    })}>
      <div className={classes.itemRow}>
        <div className={classes.cellOne}>
          {
            docRelatedParts.length > 0 &&
            <span className={cx(classes.iconClass, "iconClass")} onClick={toggleItem}>
              <ChevronRightIcon fontSize="small" className={classes.showMoreIcon}/>
            </span>
          }
          <span>{docTitle}</span>
        </div>
        <div className={cx(classes.cellTwo, classes.itemLeftPadding)}>
          <span>{descriptionOfChange}</span>
        </div>
        <div className={cx(classes.cellThree, classes.itemLeftPadding)}>
          <span>{justificationOfChange}</span>
        </div>
      </div>
      {
        docRelatedParts.length > 0 && expanded &&
        <div className={cx(classes.moreDetails, classes.fullWidth)}>
          <hr className={classes.separator}/>
          <h4 className={classes.moreDetailsHeader}>Related Parts</h4>
          <ul className={classes.docList}>
            {
              docRelatedParts.map((part) => (
                <li key={part.revId} className={classes.docListItem}>{part.titleText}</li>
              ))
            }
          </ul>
        </div>
      }
      <div className={cx(classes.actionButtonChildDiv, "actionBtnClass")}>
        <Button className={cx(classes.actionButton, classes.actionButtonDelete)}>
          <DeleteIcon className={classes.iconButton} />
        </Button>
        <Button className={classes.actionButton}>
          <EditIcon className={classes.iconButton} onClick={editItem}/>
        </Button>
      </div>
    </div>
  );
};

export default ChangeOrderViewGridItem;
