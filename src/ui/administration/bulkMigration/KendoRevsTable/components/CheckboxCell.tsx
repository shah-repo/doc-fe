import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEvent, ReactElement } from 'react';
import { translate } from '../../../../../common/intl';
import { MomentFormats } from '../../../../../common/utils/date';
import DateTime from '../../../../components/DateTime';
import { Checkbox } from '../../../../components/forms/fields-next';
import { MigrationStatus } from '../../interface';
import { SELECTED_FIELD } from '../constants';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

const CheckboxCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  dataIndex,
  selectionChange,
  handlePopoverOpen,
  handlePopoverClose,
}) => {
  const classes = useStyles();
  const { runDetails = [], status } = dataItem;
  const run = runDetails[0];
  const labelId = `enhanced-table-checkbox-${dataIndex}`;

  const handleIconHover = (event: MouseEvent<HTMLDivElement>) => {
    const hasStarted = status === MigrationStatus.IN_PROGRESS;
    const hasCompleted = status === MigrationStatus.COMPLETED;
    const hasFailed = status === MigrationStatus.FAILED;

    const renderCompletedContent = () => (
      <>
        {translate('administration.bulk.migration.rev.grid.cell.completedAt')}{' '}
        <DateTime
          value={run?.completedAt}
          format={MomentFormats.BriefDateTime}
          className={classes.revsTableDateTimeLabel}
        />{' '}
        {translate('administration.bulk.migration.rev.grid.cell.startedAt.prefix')}{' '}
        <DateTime
          value={run?.runAt}
          format={MomentFormats.BriefDateTime}
          className={classes.revsTableDateTimeLabel}
        />
        {hasFailed && (
          <>
            <br />
            {run?.failureReason?.message ?? translate('administration.bulk.migration.rev.grid.cell.error')}
          </>
        )}
      </>
    );

    const renderInProgressContent = () => (
      <>{translate('administration.bulk.migration.rev.grid.cell.inprogress')}</>
    );

    const renderNotAttemptedContent = () => (
      <>{translate('administration.bulk.migration.rev.grid.cell.notAttempted')}</>
    );

    const contentEl: ReactElement = (
      <>
        {hasStarted && hasCompleted && renderCompletedContent()}
        {hasStarted && !hasCompleted && renderInProgressContent()}
        {!hasStarted && renderNotAttemptedContent()}
      </>
    );

    handlePopoverOpen?.(event, contentEl);
  };

  return (
    <div className={classes.checkboxRowContent} onMouseEnter={handleIconHover} onMouseLeave={handlePopoverClose}>
      {status !== MigrationStatus.COMPLETED && (
        <Checkbox
          checked={dataItem[SELECTED_FIELD]}
          onChange={(event) => selectionChange?.({ syntheticEvent: event as React.SyntheticEvent })}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      )}
      {status === MigrationStatus.COMPLETED && (
        <FontAwesomeIcon size="xl" icon={solid('check-double')} className={classes.checkboxRowContentDone} />
      )}
      {status === MigrationStatus.FAILED && (
        <FontAwesomeIcon size="lg" icon={solid('circle-exclamation')} className={classes.checkboxRowContentFailed} />
      )}
      {status === MigrationStatus.IN_PROGRESS && (
        <FontAwesomeIcon size="xl" icon={regular('hourglass')} className={classes.checkboxRowContentInProgress} />
      )}
    </div>
  );
};

export default CheckboxCell;
