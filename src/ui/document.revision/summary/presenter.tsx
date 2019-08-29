import {
  Box,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
  Grid,
} from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import Text from "../../components/Text";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import Attachment from "./attachment";
import ChangeRequestLink from "./changeRequestLink";
import ReferenceContainer from "./reference.container";
import DocumentHeader from "./header";
import styles from "./styles";

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
        direction="column"
      >
        <ChangeRequestLink dataProp={dataProp} />
        <SummaryField label="document.title" value={name} />
        <SummaryFieldWithHtml label="common.description" value={description} />
        {referenceTo && (
          <ReferenceContainer
            dataProp={referenceTo}
            isReferenceTo={true}
            status={status}
            deprecatedAt={deprecatedAt}
          />
        )}
        {document.referencedBy && (
          <ReferenceContainer
            dataProp={document.referencedBy}
            isReferenceTo={false}
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
