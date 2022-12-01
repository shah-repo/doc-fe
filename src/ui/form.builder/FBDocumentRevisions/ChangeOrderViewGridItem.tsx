/* eslint-disable no-console */
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import { FBAutocompleteAsyncOption, FBDocumentRevisionResponse, FBDocumentRevisionsItemProps } from "..";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { RELATED_PARTS_ROOT_URL } from "../../../state/ducks/relatedParts/constants";
import { RelatedPartsListItem } from "../../../state/ducks/relatedParts/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import useStyles from "./ChangeOrderGrid.styles";

const ChangeOrderViewGridItem: React.FunctionComponent<FBDocumentRevisionsItemProps> = ({
  handleOpen,
  remove,
  id,
  index = 0,
  disabled,
  name,
  justificationOfChange,
  descriptionOfChange,
}) => {
  const classes = useStyles();
  console.log(id, name, index);

  const [docTitle, setDocTitle] = useState("");
  const [docRelatedParts, setDocRelatedParts] = useState<{revId: string; titleText: string}[]>([]);
  const [expanded, setExpanded] = useState(false);

  const documentDetailsApi: FBRequest<DocumentRevision, null> = new FBRequest();
  documentDetailsApi.setUrl({
    url: FBEndpoint.FetchAutocompleteValue,
    values: { id, optionId: FBAutocompleteAsyncOption.documentRevisions },
  });

  const getDocumentDetails = async () => {
    const { document, displayRevision, name }: FBDocumentRevisionResponse = await documentDetailsApi.fetch();
    const documentTitleText = generateDocTitleText(
      document.docId, displayRevision, name
    );
    setDocTitle(documentTitleText);

    if (document.documentType.group === DOC_TYPE_GROUP.PART) {
      // get the related parts for this document.
      documentDetailsApi.setUrl(`${RELATED_PARTS_ROOT_URL}/${document.id}`);
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
    }
  };

  useEffect(() => {
    getDocumentDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDocTitleText = (docId: string, displayRevision: string, name: string) => (
    `${docId} # rev ${displayRevision} - ${name}`
  );

  const toggleItem = () => {
    setExpanded(!expanded);
  };

  return (
    // <div className={cx(classes.itemRow, {
    //   [classes.itemRowDefaultColor]: !expanded,
    //   [classes.itemRowOpenedColor]: expanded,
    // })}>
    <div className={cx(classes.enclosingDiv, classes.enclosingDivColor, {
      [classes.enclosingDivOpened]: expanded,
    })}>
      <div className={classes.itemRow}>
        <div className={classes.cellOne}>
          <span className={cx(classes.iconClass, "iconClass")} onClick={toggleItem}>
            <ChevronRightIcon fontSize="small" className={classes.showMoreIcon}/>
          </span>
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
                <li key={part.revId}>{part.titleText}</li>
              ))
            }
          </ul>
        </div>
      }
    </div>
  );
};

export default ChangeOrderViewGridItem;
