import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertHtmlToDraft } from "../../components/forms/fields/RichTextEditor/helpers";
import Text from "../../components/Text";
import styles from "./styles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
  labelProps,
  labelFont,
}) => {
  const [editor, setEditor] = useState();
  useEffect(() => {
    setEditor(convertHtmlToDraft(value));
  }, [value]);

  return (
    <Grid item={true} xs={12} style={{ marginBottom: "-24px" }}>
      {label && (
        <Grid item={true} xs={12} id="BaseWithhtml-label">
          <Typography style={labelProps}>
            <Text message={label} />
          </Typography>
        </Grid>
      )}
      <Grid item={true} xs={12} id="BaseWithhtml-editor" data-cy="BaseWithhtml-editor">
        <Editor
          readOnly={true}
          editorState={editor}
          toolbarHidden={true}
          editorClassName={classes.descriptionContainer}
          editorStyle={labelFont}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(BaseWithhtml);
