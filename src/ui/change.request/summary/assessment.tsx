import { Grid, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import {
  Assessment as Model,
  AssessmentItem,
  AssessmentType,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<Model> & WithStyles<typeof styles>;

const Assessment: React.FunctionComponent<Props> = ({ classes, dataProp }) => {
  const attachmentRenderer = (item: AssessmentItem) =>
    item.attachments!.map((attachment) => (
      <FileCard key={`assessment-${attachment.id}`} attachment={attachment} />
    ));

  const reasoningRenderer = (item: AssessmentItem) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1">{`${item.reasoning}` || "—"}</Typography>
    </Grid>
  );

  const itemRenderer = () =>
    Object.values(AssessmentType).map((type, index) => {
      const item = dataProp[type as keyof typeof AssessmentType];
      return (
        <Grid item xs={12} key={`${item}-${index}`}>
          <Grid item xs={12}>
            <Typography variant="h5">
              <Text message={`common.${type}`} />:
            </Typography>
          </Grid>
          {item.reasoning && reasoningRenderer(item)}
          {item.attachments && (
            <Grid item xs={12}>
              {attachmentRenderer(item)}
            </Grid>
          )}
        </Grid>
      );
    });

  return (
    <Grid item xs={12}>
      <Grid container={true} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">
            <Text translation="common.assessments" />:
          </Typography>
          <Typography variant="subtitle1">
            {`${dataProp.description}` || "—"}
          </Typography>
        </Grid>
        {itemRenderer()}.
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Assessment);
