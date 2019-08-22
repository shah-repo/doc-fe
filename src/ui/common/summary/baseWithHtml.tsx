import { Grid, ListItem, Typography } from "@material-ui/core";
import React from "react";
import ReactQuill from "react-quill";
import Text from "../../components/Text";
import { SummaryBaseProps } from "./types";
import { getInnerHTMLProp, sanitizeHtml } from "../../../common/utils/helpers";

type Props = SummaryBaseProps;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
}) => (
  <ListItem>
    <Grid item={true} xs={4}>
      <Typography variant="body1"><Text message={label} />:</Typography>
    </Grid>
    <Grid item={true} xs={8}>
      <ReactQuill
        readOnly={true}
        value={sanitizeHtml(value)}
        modules={{ toolbar: false }}
      >
        <div style={{ border: "none" }} />
      </ReactQuill>
    </Grid>
  </ListItem>
);

export default BaseWithhtml;
