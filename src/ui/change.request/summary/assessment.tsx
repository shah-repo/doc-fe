import { Box, Grid, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { AssessmentItem, AssessmentProps, AssessmentType } from "../../../state/ducks/changeRequest";
import BaseSummaryField from "../../common/summary/base";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "./styles";

type Props = AssessmentProps & WithStyles<typeof styles>;

const Assessment: React.FunctionComponent<Props> = ({
  classes,
  assessment,
}) => {

  const attachmentRenderer = (item: AssessmentItem) =>
    <FileCard attachment={item.attachment!} />;

  const reasoningRenderer = (item: AssessmentItem) =>
    <BaseSummaryField label="common.reasoning" value={item.reasoning} />;

  const itemRenderer = () => Object.values(AssessmentType).map((type, index) => {
    const item = assessment[type as keyof typeof AssessmentType];
    return (
      <Box key={`${item}-${index}`}>
        <ListItem>
          <Typography variant="button"><Text message={`common.${type}`} />:</Typography>
        </ListItem>
        {item.reasoning && reasoningRenderer(item)}
        {item.attachment && <ListItem><Grid container={true} spacing={2}>{attachmentRenderer(item)}</Grid></ListItem>}
      </Box>
    );
  });

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation="common.assessments" />:</Typography>
      </ListItem>
      <BaseSummaryField label="common.description" value={assessment.description} />
      {itemRenderer()}
    </Box>
  );
};

export default withStyles(styles)(Assessment);
