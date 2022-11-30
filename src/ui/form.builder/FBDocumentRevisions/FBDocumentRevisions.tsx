import React from "react";
import { FBDialog, FBDocumentRevisionsProps, FBDocumentRevisionsValue, FBInput, FBMapWrapper, FBProvider } from "..";
import useStyles from "./ChangeOrderGrid.styles";
import ChangeOrderGridHeader from "./ChangeOrderGridHeader";
import ChangeOrderGridItem from "./ChangeOrderViewGridItem";
import { withFBDocumentRevisions } from "./FBDocumentRevisions.wrap";

const FBDocumentRevisions: React.FunctionComponent<FBDocumentRevisionsProps> = ({
  handleForm,
  handleOpen,
  remove,
  dialogState,
  collection = [],
  name,
  gutter,
  disabled,
  index,
}) => {
  const classes = useStyles();
  return (
    <FBProvider {...{ dialogState }}>
      <FBDialog />
      <FBInput {...{ name, gutter, index }} type="documentRevisions">
        <div className={classes.fullWidth}>
          <ChangeOrderGridHeader />
          <FBMapWrapper<FBDocumentRevisionsValue[]> {...{ collection }}>
            {(value: FBDocumentRevisionsValue, index) => (
              // <FBDocumentRevisionsItem
              //   key={`fb-document-revision-${value.id}-${index}`}
              //   {...{ name, disabled, index, handleOpen, remove }}
              //   id={value.proposedDocumentRevision.id}
              // />
              <ChangeOrderGridItem
                key={`fb-document-revision-${value.id}-${index}`}
                {...{ name, disabled, index, handleOpen, remove }}
                justificationOfChange={value.justificationOfChange}
                descriptionOfChange={value.descriptionOfChange}
                id={value.proposedDocumentRevision.id}
              />
            )}
          </FBMapWrapper>
        </div>
        {/* <FBButton
          {...{ disabled }}
          fullWidth={true}
          label="form.builder.add.document"
          variant="outlined"
          style={{ margin: 0 }}
          onClick={handleForm}
          dataCy={"fb.add.document"}
        /> */}
      </FBInput>
    </ FBProvider>
  );
};

export default withFBDocumentRevisions(FBDocumentRevisions);
