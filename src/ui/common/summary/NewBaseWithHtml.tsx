import { Box, Button, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useIntl } from 'react-intl';
import { SM } from '../../../App';
import { SMEditorStyles } from '../../../App/Shifamed/Components/SMTextEditor/SMTextEditor.styles';
import { convertHtmlToDraft } from '../../components/forms/fields/RichTextEditor/helpers';
import { styles } from './newStyles';
import { SummaryBaseProps } from './types';

type Props = SummaryBaseProps;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  labelStyle,
  valueStyle,
}) => {
  const { _documentRevisionFormState } = SM.useStores();
  const descriptionClasses = SMEditorStyles();
  const intl = useIntl();
  const [isTextClamped, setIsTextClamped] = useState(false);
  const viewMore = intl.formatMessage({ id: 'document.revision.view.more' });
  const viewLess = intl.formatMessage({ id: 'document.revision.view.less' });
  const [editor, setEditor] = useState();
  const [btnText, setBtnText] = useState(viewMore);
  const [flag, setFlag] = useState(false);
  const classes = styles(isTextClamped);
  useEffect(() => {
    setEditor(convertHtmlToDraft(value));
    showToggleButton();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const toggleBtn = () => {
    setFlag(!flag);
    if (flag) {
      _documentRevisionFormState?.setExpanded(false);
      setBtnText(viewMore);
    } else {
      _documentRevisionFormState?.setExpanded(true);
      setBtnText(viewLess);
    }
  };

  const showToggleButton = () => {
    setTimeout(() => {
      const elm = document.querySelector('.rdw-editor-main');
      const isClamped = elm ? elm.scrollHeight > elm.clientHeight : false;
      setIsTextClamped(isClamped);
      _documentRevisionFormState?.setIsDescTextClamped(isClamped);
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
                lineHeight: '24px',
              }}
            />
          </Grid>
          <Grid item>
            <Button variant="text" className={classes.moreOrLess} onClick={() => toggleBtn()}>{btnText}</Button>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BaseWithhtml;
