import {
  Box,
  Grid,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import Attachment from "./attachment";
import ChangeRequestLink from "./changeRequestLink";
import DocumentHeader from "./header";
import styles from "./styles";
import ReferenceToContainer from "./referenceTo.container";
import ReferencedByContainer from "./referencedBy.container";
import Text from "../../components/Text";

interface OwnProps {
  canShowCreateVersionButton?: boolean;
}

type Props = OwnProps & DataProps<DocumentRevision> & WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  dataProp: {
    document,
    attachments,
    status,
    name,
    retrain,
    referenceTo,
    deprecatedAt,
    description,
  },
  canShowCreateVersionButton,
}) => {
  const onSubmit = () => void 0;

  const contentRenderer = () => (
    <Box>
      <DocumentHeader dataProp={dataProp} />
      <Grid
        container={true}
        className={classes.previewBox}
        spacing={4}
        direction="column">
        <ChangeRequestLink dataProp={dataProp} />
        <SummaryField label="document.title" value={name} />
        <SummaryField
          label="document.revision.trainingRequired"
          value={<Text translation={retrain ? "document.yes" : "document.no"} />}
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
      </Grid>
      <Box className={classes.submitBox}>
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
