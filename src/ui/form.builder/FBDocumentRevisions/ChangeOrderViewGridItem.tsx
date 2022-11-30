/* eslint-disable no-console */
import cx from "classnames";
import React, { useEffect } from "react";
import { FBAutocompleteAsyncOption, FBDocumentRevisionResponse, FBDocumentRevisionsItemProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
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

  const [docTitle, setDocTitle] = React.useState("");

  const documentDetailsApi: FBRequest<DocumentRevision, null> = new FBRequest();
  documentDetailsApi.setUrl({
    url: FBEndpoint.FetchAutocompleteValue,
    values: { id, optionId: FBAutocompleteAsyncOption.documentRevisions },
  });

  const getDocumentDetails = async () => {
    const response: FBDocumentRevisionResponse = await documentDetailsApi.fetch();
    const documentTitleText = `${response.document.docId} - rev ${response.displayRevision} - ${response.name}`;
    setDocTitle(documentTitleText);
  };

  useEffect(() => {
    getDocumentDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.itemRow}>
      <div className={classes.cellOne}>
        <span>{docTitle}</span>
      </div>
      <div className={cx(classes.cellTwo, classes.itemLeftPadding)}>
        <span>{descriptionOfChange}</span>
      </div>
      <div className={cx(classes.cellThree, classes.itemLeftPadding)}>
        <span>{justificationOfChange}</span>
      </div>
    </div>
  );
};

export default ChangeOrderViewGridItem;
