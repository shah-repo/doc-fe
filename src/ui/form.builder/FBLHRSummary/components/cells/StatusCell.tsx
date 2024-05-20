import { Chip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { statusClassMapping } from '../../../../components/common/kendo/helpers';
import Tooltip from '../../../../components/common/kendo/Tooltip';
import { EMPTY_PLACEHOLDER, STATUS_OPTIONS } from '../../constants';
import { CustomTemplateProps } from '../../types';
import { getLotStatus } from '../../utils';
import useStyles from './Status.styles';

type StatusCellProps = {lotDocs: DocumentRevision[]} & CustomTemplateProps;

export const StatusCell: React.FC<StatusCellProps> = ({
  dataItem,
  field,
  lotDocs,
  ...props
}) => {
  const classes = useStyles();

  const defaultValue = getLotStatus(dataItem?.lotOrEquipment ?? '', lotDocs) ?? dataItem[field];
  const displayStatus = STATUS_OPTIONS.find((option) => option.value === defaultValue)?.label ?? defaultValue;

  return (
    <>
      {displayStatus ? (
        <Tooltip
          data={displayStatus}
          childrenElement={
            <Chip
              size="small"
              className={cx(
                classes.chip,
                classes[statusClassMapping[displayStatus]],
              )}
              label={displayStatus}
            />
          }
        />
      ) : (
        EMPTY_PLACEHOLDER
      )}
    </>
  );
};
