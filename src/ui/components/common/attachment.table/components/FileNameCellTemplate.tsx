import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { LINE_TYPES } from '../../../../../state/ducks/attachments/constants';
import { Attachment } from '../../../../change.request/form/types';
import useOverflow from '../../../../hooks/useOverflow';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';
import useStyles from '../styles';

const FileNameCellTemplate: React.FC<any> = ({ props, documentRevision, onView }) => {
  const classes = useStyles();
  const { dataItem, field } = props || {};
  const attachment = dataItem as Attachment;
  const [overflowRef, isOverflowing] = useOverflow<HTMLDivElement>();
  const fileName = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;
  const extension = get(dataItem, 'type', EMPTY_VALUE_PLACEHOLDER) as string;
  const isRedlineIcon = dataItem?.lineType === LINE_TYPES.RED_LINE;
  const isPrimary = dataItem?.id === documentRevision?.primaryAttachment?.id;

  return (
    <Tooltip
      {...props}
      title={isOverflowing ? `${fileName}.${extension}` : ''}
    >
    <div ref={overflowRef} className={classes.fileNameContainer} onClick={onView(attachment)}>
      <Box minWidth={20}>
        {isPrimary && (<FontAwesomeIcon className={classes.primaryIcon} icon={solid('circle-star')} />)}
        {isRedlineIcon && (<FontAwesomeIcon className={classes.redLineIcon} icon={regular('paperclip')} />)}
      </Box>
      <div className={classes.fileName}>
        {fileName}.{extension}
      </div>
    </div>
    </Tooltip>
  );
};

export default FileNameCellTemplate;
