import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React, { MouseEvent, ReactElement } from 'react';
import { translate } from '../../../../../common/intl';
import { MomentFormats } from '../../../../../common/utils/date';
import DateTime from '../../../../components/DateTime';
import { Checkbox } from '../../../../components/forms/fields-next';
import { MIGRATION_STATUS_ENUM } from '../../interface';
import { SELECTED_FIELD } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

const CheckboxCell: React.FC<CustomTemplateProps> = ({ dataItem, dataIndex, selectionChange, handlePopoverOpen, handlePopoverClose }) => {
  const classes = styles();
  const { runDetails, status } = dataItem;
  const labelId = `enhanced-table-checkbox-${dataIndex}`;

  const handleIconHover = (event: MouseEvent<HTMLDivElement>) => {
    const contentEl: ReactElement
      = <>
        { runDetails[0]?.runAt && runDetails[0]?.completedAt
        && <>
          <>
            {translate('administration.bulk.migration.rev.grid.cell.completedAt')} <DateTime
              value={runDetails[0]?.completedAt}
              format={MomentFormats.BriefDateTime}
              className={cx(classes.revsTableDateTimeLabel)}
            /> {translate('administration.bulk.migration.rev.grid.cell.startedAt.prefix')} <DateTime
              value={runDetails[0]?.runAt}
              format={MomentFormats.BriefDateTime}
              className={cx(classes.revsTableDateTimeLabel)}
            />
          </>
          {
            runDetails[0]?.failureReason
              && <><br />{runDetails[0]?.failureReason?.message ?? translate('administration.bulk.migration.rev.grid.cell.error')}</>
          }
        </>
        }
        { runDetails[0]?.runAt && !runDetails[0]?.completedAt
             && <>
               {translate('administration.bulk.migration.rev.grid.cell.startedAt.suffix')} <DateTime
                 value={runDetails[0]?.runAt}
                 format={MomentFormats.BriefDateTime}
                 className={cx(classes.revsTableDateTimeLabel)}
               /> {translate('administration.bulk.migration.rev.grid.cell.inprogress')}
             </>
        }
        { !runDetails[0]?.runAt
             && <>
               {translate('administration.bulk.migration.rev.grid.cell.notAttempted')}
             </>
        }
      </>;
    handlePopoverOpen?.(event, contentEl);
  };

  return (
    <div className={classes.checkboxRowContent}
      onMouseEnter={handleIconHover}
      onMouseLeave={handlePopoverClose}
    >
      { status !== MIGRATION_STATUS_ENUM.COMPLETED && <Checkbox
        checked={dataItem[SELECTED_FIELD]}
        onChange={(event) => selectionChange?.({ syntheticEvent: event as React.SyntheticEvent })}
        inputProps={{ 'aria-labelledby': labelId }}
      /> }
      {
        (status === MIGRATION_STATUS_ENUM.COMPLETED)
                && <FontAwesomeIcon size="xl" icon={solid('check-double')} className={classes.checkboxRowContentDone} />
      }
      {
        status === MIGRATION_STATUS_ENUM.FAILED
                && <FontAwesomeIcon size="lg" icon={solid('circle-exclamation')} className={classes.checkboxRowContentFailed} />
      }
      {
        status === MIGRATION_STATUS_ENUM.IN_PROGRESS
                && <FontAwesomeIcon size="xl" icon={regular('hourglass')} className={classes.checkboxRowContentInProgress} />
      }
    </div>
  );
};

export default CheckboxCell;
