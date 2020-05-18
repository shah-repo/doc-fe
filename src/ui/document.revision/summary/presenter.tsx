import { Box, Grid, WithStyles, withStyles } from "@material-ui/core";
import { Formik } from "formik";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../../state/reducers";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import { FormContext } from "../../components/forms/FormContext";
import Text from "../../components/Text";
import DocumentRevisionOutputInfo from "../../documentRevision/formBuilder/DocumentRevisionOutputInfo";
import FBWorkspace from "../../form.builder/containers/workspace/FBWorkspace";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import FBStore from "../../form.builder/stores/ui/FBStore";
import SummaryHeader from "../header/SummaryHeader";
import Attachment from "./attachment";
import ChangeRequestLink from "./changeRequestLink";
import ReferencedByContainer from "./referencedBy.container";
import ReferenceToContainer from "./referenceTo.container";
import styles from "./styles";
import TrainingControl from "./training.control";

interface OwnProps {
  canShowCreateVersionButton?: boolean;
  canChangeOwnerShip?: boolean;
}

export type Props = OwnProps &
DataProps<DocumentRevision> &
WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  dataProp: {
    id,
    document,
    attachments,
    status,
    name,
    retrain,
    referenceTo,
    deprecatedAt,
    description,
    trainingRecords,
    formTemplate,
    formDocument,
  },
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => {
  const onSubmit = () => void 0;
  FBDRStore.setValues(dataProp);
  const outputDocumentTypeName = useSelector((state: ApplicationState) =>
    formTemplate ?
      formTemplate.outputDocumentTypes.map((i) => documentTypeSelectors.getDocTypeName(state, i.id)).join(", ") :
      []
  );

  const renderTrainingControl = status === DocumentRevisionStatus.Released && (
    <TrainingControl
      dataProp={trainingRecords}
      classes={classes}
      documentRevisionId={id}
    />
  );

  const contentRenderer = () => (
    <Box>
      <SummaryHeader
        documentRevision={dataProp}
        canChangeOwnerShip={canChangeOwnerShip}
        canShowCreateVersionButton={canShowCreateVersionButton}
      />
      <Grid
        container={true}
        className={classes.previewBox}
        spacing={4}
        direction="column"
      >
        <ChangeRequestLink dataProp={dataProp} />
        {FBDRStore.isOutput && (
          <Box ml={2} mt={1}>
            <DocumentRevisionOutputInfo formDocument={dataProp?.formDocument} />
          </Box>
        )}
        <SummaryField label="document.title" value={name} />
        <SummaryField
          label="document.revision.trainingRequired"
          value={<Text translation={retrain ? "common.yes" : "common.no"} />}
        />
        <SummaryFieldWithHtml label="common.description" value={description} />
        {formTemplate && (
          <SummaryField
            label="document.output.type"
            value={outputDocumentTypeName}
          />
        )}
        {referenceTo && (
          <ReferenceToContainer
            dataProp={referenceTo}
            status={status}
            deprecatedAt={deprecatedAt}
          />
        )}
        {document.referencedBy && (
          <ReferencedByContainer dataProp={document.referencedBy} />
        )}
        {attachments && <Attachment />}
        {renderTrainingControl}
      </Grid>

      {FBStore.active && (
        <Box px={5} id="Presenter-FBWorkspace">
          <FBWorkspace
            documentId={_.get(formDocument, "document.id") || _.get(document, "id")}
            document={dataProp}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={dataProp}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {contentRenderer}
      </Formik>
    </FormContext.Provider>
  );
};

Presenter.displayName = "DocRevSummaryPresenter";

export default withStyles(styles)(Presenter);
