import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './ApprovalRequestGrid.styles';

interface Props {
  isLineItemPartCanBeSubstituted?: boolean
}

const ApprovalRequestGridHeader: React.FunctionComponent<Props> = ({
  isLineItemPartCanBeSubstituted,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.tableHeader}>
      {isLineItemPartCanBeSubstituted && (
        <div className={cx(classes.headerCell, classes.autoUpdateCell)}>
          <Tooltip
            title={translate('approvalRequest.grid.heading.autoUpdate.title')}
            placement="right"
          >
            <FontAwesomeIcon icon={regular('memo-circle-check')} size="lg" />
          </Tooltip>
        </div>
      )}
      <div className={cx(classes.headerCell, classes.itemCell)}>
        {translate('approvalRequest.grid.heading.item')}
      </div>
      <div className={cx(classes.headerCell)}>
        {translate('approvalRequest.grid.heading.rev')}
      </div>
      <div className={cx(classes.headerCell)}>
        {translate('common.attachments')}
      </div>
      <div className={cx(classes.headerCell, classes.textCell)}>
        {translate('approvalRequest.grid.heading.description.of.change')}
      </div>
      <div className={cx(classes.headerCell, classes.textCell)}>
        {translate('approvalRequest.grid.heading.justification.of.change')}
      </div>
      <div className={cx(classes.headerCell, classes.whereUsedCell)}>
        <Tooltip title={translate('approvalRequest.grid.heading.where.used')}>
          <FontAwesomeIcon icon={regular('list-tree')} size="lg" />
        </Tooltip>
      </div>
    </div>
  );
};

export default withThemeNext(ApprovalRequestGridHeader);
