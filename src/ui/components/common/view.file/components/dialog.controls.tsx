import { Button } from '@material-ui/core';
import React, { useContext, useMemo } from 'react';
import Text from '../../../Text';
import { AttachmentSliderContext } from '../../attachment.icon/AttachmentSlideProvider';
import { checkIfFileIsViewable } from '../utils/helpers';
import { styles } from '../utils/styles';
import { ViewFileTitleControlsProps } from '../utils/types';

const ViewFileTitleControls: React.FunctionComponent<ViewFileTitleControlsProps> = ({
  attachment = {},
  attachments,
}) => {
  const { setFile } = useContext(AttachmentSliderContext);
  const { setPreviousAttachment, setNextAttachment } = useMemo(() => {
    const viewableFiles = attachments.filter((item) => checkIfFileIsViewable(item.type));
    if (viewableFiles.length === 1) {
      return { setPreviousAttachment: undefined, setNextAttachment: undefined };
    }
    const currentIndex = viewableFiles.findIndex((item) => item.id === attachment.id);

    const setPrevious = currentIndex === 0
      ? undefined
      : () => setFile?.(viewableFiles[currentIndex - 1]);
    const setNext = (currentIndex + 1) >= viewableFiles.length
      ? undefined
      : () => setFile?.(viewableFiles[currentIndex + 1]);

    return { setPreviousAttachment: setPrevious, setNextAttachment: setNext };
  }, [attachment, attachments, setFile]);
  const classes = styles();

  const prevDisabled = !setPreviousAttachment;
  const nextDisabled = !setNextAttachment;

  return (
    <span className={classes.buttonsContainer}>
      {!prevDisabled && (
        <Button
          color="secondary"
          variant="outlined"
          disabled={prevDisabled}
          onClick={setPreviousAttachment}
          className={classes.previousButton}
        >
          <Text translation="common.previous" />
        </Button>
      )}
      {!nextDisabled && (
        <Button
          color="secondary"
          variant="contained"
          disabled={nextDisabled}
          onClick={setNextAttachment}
        >
          <Text translation="common.next" />
        </Button>
      )}
    </span>
  );
};

export default ViewFileTitleControls;
