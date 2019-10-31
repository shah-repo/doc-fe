import {
  Box,
  Grid,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import Text from "../../components/Text";
import DocumentRevisionOutputInfo from "../../documentRevision/formBuilder/DocumentRevisionOutputInfo";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import FBWorkspace from "../../form.builder/main/workspace/FBWorkspace";
import documentRevisionStore from "../../form.builder/stores/custom/FBDocumentRevisionStore";
import formBuilderStore from "../../form.builder/stores/FBStore";
import Attachment from "./attachment";
import ChangeRequestLink from "./changeRequestLink";
import DocumentHeader from "./header";
import ReferencedByContainer from "./referencedBy.container";
import ReferenceToContainer from "./referenceTo.container";
import styles from "./styles";
import TrainingControl from "./training.control";

interface OwnProps {
  canShowCreateVersionButton?: boolean;
}

export type Props = OwnProps & DataProps<DocumentRevision> & WithStyles<typeof styles>;

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
  },
  canShowCreateVersionButton,
}) => {
  const onSubmit = () => void 0;

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
        {documentRevisionStore.outputInfo && <DocumentRevisionOutputInfo />}
        <ChangeRequestLink dataProp={dataProp} />
        <SummaryField label="document.title" value={name} />
        <SummaryField
          label="document.revision.trainingRequired"
          value={<Text translation={retrain ? "common.yes" : "common.no"} />}
        />
        <SummaryFieldWithHtml label="common.description" value={description} />
        {
          referenceTo &&
          <ReferenceToContainer
            dataProp={referenceTo}
            status={status}
            deprecatedAt={deprecatedAt}
          />
        }
        {document.referencedBy && (
          <ReferencedByContainer
            dataProp={document.referencedBy}
          />
        )}
        {attachments && <Attachment />}
        {renderTrainingControl}
      </Grid>
      {formBuilderStore.active && (
         <Box px={5}>
           <FBWorkspace />
         </Box>
       )}
      <Box flexDirection="row-reverse" display="flex">
        <ControlsContainer
          documentRevision={dataProp}
          canShowCreateVersionButton={canShowCreateVersionButton}
        />
      </Box>
    </Box>
  );

  return (
    <Formik
      render={contentRenderer}
      initialValues={dataProp}
      onSubmit={onSubmit}
      enableReinitialize={true}
    />
  );
};

Presenter.displayName = "DocRevSummaryPresenter";

export default withStyles(styles)(Presenter);
