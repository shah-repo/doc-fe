import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { LINE_TYPES } from '../../../../../state/ducks/attachments/constants';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../../change.request/form/types';
import useOverflow from '../../../../hooks/useOverflow';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../KendoDataGrid/KendoDataGrid.types';
import useStyles from '../styles';

interface Props extends CellTemplateProps<Attachment> {
  documentRevision?: DocumentRevision
  onView?: (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => void
}

const FileNameCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field, documentRevision, onView } = props;
  const classes = useStyles();
  const [overflowRef, isOverflowing] = useOverflow<HTMLDivElement>();
  const fileName = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;
  const extension = get(dataItem, 'type', EMPTY_VALUE_PLACEHOLDER);
  const isRedlineIcon = dataItem?.lineType === LINE_TYPES.RED_LINE;
  const isPrimary = dataItem?.id === documentRevision?.primaryAttachment?.id;

  return (
    <Tooltip title={isOverflowing ? `${fileName}.${extension}` : ''}>
      <div ref={overflowRef} className={classes.fileNameContainer} onClick={onView?.(dataItem)}>
        <Box>
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
