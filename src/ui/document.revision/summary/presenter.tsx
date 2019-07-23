import { Box, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import SummaryField from "../../common/summary/base";
import Text from "../../components/Text";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import Attachment from "./attachment";
import Reference from "./reference";
import styles from "./styles";

type Props = DataProps<DocumentRevision> & WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {

  return(
    <Box>
      <Box className={classes.previewBox}>
        <ListItem>
          <Typography variant="h5">
            <Text translation="document.revision.list.docId" />: {dataProp.document.docId}
          </Typography>
        </ListItem>
        <SummaryField label="common.status" value={dataProp.status} />
        <SummaryField label="common.type" value={dataProp.document.type} />
        <SummaryField label="common.description" value={dataProp.description} />
        <SummaryField label="common.name" value={dataProp.name} />
        {dataProp.document.referencedBy && <Reference dataProp={dataProp.document.referencedBy} />}
        {dataProp.attachments && <Attachment dataProp={dataProp.attachments} />}
      </Box>
      <Box className={classes.submitBox}>
        <ControlsContainer documentRevision={dataProp} />
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Presenter) ;
