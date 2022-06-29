import { Box, Button, Grid, withStyles, WithStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useIntl } from "react-intl";
import { SMEditorStyles } from "../../../App/Shifamed/Components/SMTextEditor/SMTextEditor.styles";
import { convertHtmlToDraft } from "../../components/forms/fields/RichTextEditor/helpers";
import styles from "./newStyles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
  labelProps,
  labelFont,
}) => {
  const descriptionClasses = SMEditorStyles();
  const intl = useIntl();
  const [isTextClamped, setIsTextClamped] = useState(false);
  const viewMore = intl.formatMessage({ id: "document.revision.view.more" });
  const viewLess = intl.formatMessage({ id: "document.revision.view.less" });
  const [editor, setEditor] = useState();
  const [btnText, setBtnText] = useState(viewMore);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setEditor(convertHtmlToDraft(value));
    showToggleButton();
  }, [value]);

  const toggleBtn = () => {
    setFlag(!flag);
    if (flag) {
      setBtnText(viewMore);
    } else {
      setBtnText(viewLess);
    }
  };

  const showToggleButton = () => {
    setTimeout(() => {
      const elm = document.querySelector(".rdw-editor-main");
      setIsTextClamped(elm ? elm.scrollHeight > elm.clientHeight : false);
    }, 500);
  };

  return (
    <Grid item={true} xs={12}>
      <Grid item={true} xs={12} id="BaseWithhtml-editor" data-cy="BaseWithhtml-editor">
        <Box borderRadius={4}>
          <Grid item={true} xs={12} id="BaseWithhtml-editor" data-cy="BaseWithhtml-editor">
            <Editor
              readOnly={true}
              editorState={editor}
              toolbarHidden={true}
              editorClassName={!flag ? descriptionClasses.descriptionEditorClass :
                descriptionClasses.descriptionSummaryEditorClass}
              editorStyle={{
                lineHeight: "24px",
              }}
            />
          </Grid>
          <Grid item>
            <Button variant="text" className={descriptionClasses.moreOrLess}
              style={{ display: (!isTextClamped ? "none" : "inherit"), margin: 0 }}
              onClick={() => toggleBtn()}>{btnText}</Button>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(BaseWithhtml);
