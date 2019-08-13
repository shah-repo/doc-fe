import { Box, Grid, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import {
  Assessment as Model,
  AssessmentItem,
  AssessmentType,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<Model> & WithStyles<typeof styles>;

const Assessment: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {

  const attachmentRenderer = (item: AssessmentItem) => item.attachments!.map((attachment) =>
    <FileCard key={`assessment-${attachment.id}`} attachment={attachment} />);

  const reasoningRenderer = (item: AssessmentItem) =>
    <SummaryField label="common.reasoning" value={item.reasoning} />;

  const itemRenderer = () => Object.values(AssessmentType).map((type, index) => {
    const item = dataProp[type as keyof typeof AssessmentType];
    return (
      <Box key={`${item}-${index}`}>
        <ListItem>
          <Typography variant="button"><Text message={`common.${type}`} />:</Typography>
        </ListItem>
        {item.reasoning && reasoningRenderer(item)}
        {item.attachments && <ListItem><Grid container={true} spacing={2}>{attachmentRenderer(item)}</Grid></ListItem>}
      </Box>
    );
  });

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation="common.assessments" />:</Typography>
      </ListItem>
      <SummaryField label="common.description" value={dataProp.description} />
      {itemRenderer()}
    </Box>
  );
};

export default withStyles(styles)(Assessment);
