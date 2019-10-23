import {
  Grid,
  ListItem,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { Justifications } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import styles from "./styles";

export type Props = DataProps<Justifications> & WithStyles<typeof styles>;

export const Justification: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {
  const { description, attachments } = dataProp;

  const attachmentRenderer = () =>
    attachments.map((attachment, index) => (
      <AttachmentIconField
        key={attachment.id}
        name={`assessments.${attachment.type}.attachments`}
      />
    ));

  return (
    <Grid item xs={12} className={classes.box}>
      <SummaryFieldWithHtml label="common.justifications" value={description} />
      {attachments && (
        <ListItem>
          <Grid container={true} spacing={1}>
            {attachmentRenderer()}
          </Grid>
        </ListItem>
      )}
    </Grid>
  );
};

export default withStyles(styles)(Justification);
