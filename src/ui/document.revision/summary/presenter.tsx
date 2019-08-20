import {
  Box,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import Text from "../../components/Text";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import Attachment from "./attachment";
import styles from "./styles";
import ReferenceContainer from "./reference.container";
import ChangeRequestLink from "./changeRequestLink";

type Props = DataProps<DocumentRevision> & WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {
  return (
    <Box>
      <Box className={classes.previewBox}>
        <ChangeRequestLink dataProp={dataProp} />
        <ListItem>
          <Typography variant="h5">
            <Text translation="document.revision.list.docId" />:{" "}
            {dataProp.document.docId}
          </Typography>
        </ListItem>
        <SummaryField label="common.status" value={dataProp.status} />
        <SummaryField label="common.type" value={dataProp.document.type} />
        <SummaryField label="document.title" value={dataProp.name} />
        <SummaryFieldWithHtml label="cr.description" value={dataProp.description} />
        {dataProp.referenceTo && (
          <ReferenceContainer
            dataProp={dataProp.referenceTo}
            isReferenceTo={true}
            status={dataProp.status}
            deprecatedAt={dataProp.deprecatedAt}
          />
        )}
        {dataProp.document.referencedBy && (
          <ReferenceContainer
            dataProp={dataProp.document.referencedBy}
            isReferenceTo={false}
          />
        )}
        {dataProp.attachments && <Attachment dataProp={dataProp.attachments} />}
      </Box>
      <Box className={classes.submitBox}>
        <ControlsContainer documentRevision={dataProp} />
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter);
