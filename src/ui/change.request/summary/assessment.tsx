import {
  Box,
  Grid,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import {
  Assessment as Model,
  AssessmentItem,
  AssessmentType,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import AttachmentField from "../../components/common/attachment.icon/container";
import Text from "../../components/Text";
import styles from "./styles";

export type Props = DataProps<Model> & WithStyles<typeof styles>;

export const Assessment: React.FunctionComponent<Props> = ({ classes, dataProp }) => {
  const attachmentRenderer = (type: AssessmentType) => (
    <AttachmentField name={`assessments.${type}.attachments`} disabled={true} />
  );

  const reasoningRenderer = (item: AssessmentItem) => (
    <Box>
      <SummaryFieldWithHtml value={`${item.reasoning}` || "—"} />
    </Box>
  );

  const itemRenderer = () =>
    Object.values(AssessmentType).map((type, index) => {
      const item = dataProp[type as keyof typeof AssessmentType];
      return (
        <Grid key={`${item.id}`} className={classes.assessmentItem}>
          <Typography variant="h5">
            <Text message={`change.request.${type}.assessment`} />
          </Typography>
          {item.reasoning && reasoningRenderer(item)}
          {item.attachments!.length > 0 && attachmentRenderer(type)}
        </Grid>
      );
    });

  return (
    <Grid item={true} xs={12} className={classes.box}>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={12}>
          <Typography variant="h6">
            <Text translation="common.assessments" />
          </Typography>
        </Grid>
        <Grid item={true} className={classes.assessments}>
          {itemRenderer()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Assessment);
