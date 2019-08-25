import { Grid, withStyles, WithStyles, Typography } from "@material-ui/core";
import React from "react";
import ReactQuill from "react-quill";
import Text from "../../components/Text";
import { SummaryBaseProps } from "./types";
import { sanitizeHtml } from "../../../common/utils/helpers";
import styles from "./styles";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
}) => (
  <Grid item xs={12}>
    {
      label && 
      <Grid item={true} xs={12}>
        <Typography variant="h6">
          <Text message={label} />:
        </Typography>
      </Grid>
    }
    <Grid item={true} xs={12}>
      <ReactQuill
        readOnly={true}
        value={sanitizeHtml(value)}
        modules={{ toolbar: false }}
      >
        <div className={classes.descriptionContainer} />
      </ReactQuill>
    </Grid>
  </Grid>
);

export default withStyles(styles)(BaseWithhtml);
