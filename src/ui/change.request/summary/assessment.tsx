import {
  Grid,
  Typography,
  WithStyles,
  withStyles,
  Box,
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

type Props = DataProps<Model> & WithStyles<typeof styles>;

const Assessment: React.FunctionComponent<Props> = ({ classes, dataProp }) => {
  const attachmentRenderer = (type: AssessmentType) => (
    <AttachmentField name={`assessments.${type}.attachments`} disabled={true} />
  );

  const reasoningRenderer = (item: AssessmentItem) => (
    <Box>
      <Typography variant="subtitle1">
        <Text message={`${item.reasoning}` || "—"} />
      </Typography>
    </Box>
  );

  const itemRenderer = () =>
    Object.values(AssessmentType).map((type, index) => {
      const item = dataProp[type as keyof typeof AssessmentType];
      return (
        <Grid key={`${item}-${index}`} className={classes.assessmentItem}>
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
        <Grid item className={classes.assessments}>
          {itemRenderer()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Assessment);
