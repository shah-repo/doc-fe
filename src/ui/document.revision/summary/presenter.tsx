import { Box, Grid, WithStyles, withStyles } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus, FBOutputDocumentType } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../../state/reducers";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import OwnerChanger from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import Text from "../../components/Text";
import DocumentRevisionOutputInfo from "../../documentRevision/formBuilder/DocumentRevisionOutputInfo";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import { FBSchemaProps, FBWorkspace } from "../../form.builder";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import Attachment from "./attachment";
import ChangeRequestLink from "./changeRequestLink";
import DocumentHeader from "./header";
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
  const outputDocumentTypeName = useSelector((state: ApplicationState) =>
    formTemplate ? (formTemplate.outputDocumentTypes as FBOutputDocumentType[]).map((i) =>
      documentTypeSelectors.getDocTypeName(state, i.id)).join(", ") : []);
  const { formInput } = dataProp || {};
  const { schema } = dataProp.formTemplate || dataProp.formDocument?.formTemplate || {};
  const FBIsActive = formInput || formTemplate || formDocument;
  const renderTrainingControl = status === DocumentRevisionStatus.Released && (
    <TrainingControl
      dataProp={trainingRecords}
      classes={classes}
      documentRevisionId={id}
    />
  );

  const contentRenderer = () => (
    <Box>
      <DocumentHeader dataProp={dataProp} />
      <Grid
        container={true}
        className={classes.previewBox}
        spacing={4}
        direction="column"
      >
        <ChangeRequestLink dataProp={dataProp} />
        {FBDRStore.isOutput && (
          <Box ml={2} mt={1}>
            <DocumentRevisionOutputInfo dataProp={dataProp} />
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

      {FBIsActive && (
        <Box px={5} mt={4} id="Presenter-FBWorkspace">
          <FBWorkspace
            document={dataProp}
            initialValues={dataProp.formInput}
            schema={schema as FBSchemaProps[]}
            mode="preview"
          />
        </Box>
      )}
      <Box flexDirection={document.canAccess ? "row-reverse" : "row"} display="flex" px={3}>
        {canChangeOwnerShip && (
          <OwnerChanger
            requestId={id}
            requestType={RequestType.Document}
          />
        )}
        <ControlsContainer
          documentRevision={dataProp}
          canShowCreateVersionButton={canShowCreateVersionButton}
          hasAccess={document.canAccess}
        />
      </Box>
    </Box>
  );

  return (
    <Formik
      initialValues={dataProp}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {contentRenderer}
    </Formik>
  );
};

Presenter.displayName = "DocRevSummaryPresenter";

export default withStyles(styles)(Presenter);
