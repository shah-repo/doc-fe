import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import Text from "../../components/Text";
import styles from "./styles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
}) => {
  const [editor, setEditor] = useState();
  useEffect(() => {
    const contentBlock = htmlToDraft(value || "");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditor(editorState);
    }
  }, []);

  return (
    <Grid item={true} xs={12}>
      {label && (
        <Grid item={true} xs={12}>
          <Typography variant="h6">
            <Text message={label} />
          </Typography>
        </Grid>
      )}
      <Grid item={true} xs={12}>
        <Editor
          readOnly={true}
          editorState={editor}
          toolbarHidden={true}
          editorClassName={classes.descriptionContainer}
        />
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(BaseWithhtml);
