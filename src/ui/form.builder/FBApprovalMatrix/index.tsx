import React from 'react';
import Grid from './components/Grid';
import { GridProps } from './components/Grid/types';
import useStyles from './components/Grid/styles';
import createSchema from './schema';
import { withFBApprovalMatrix } from './wrap';
import { FB, FBProvider, FBDialog, FBDialogState, FBApprovalMatrixProps, FBApprovalMatrixRoleTitles, FBApprovalMatrixItem, FBApprovalRolesStages, FBDocTypeGroup } from '..';
import { translate } from '../../../common/intl';
import { IconButton } from '../../components/forms/fields-next';
import FullscreenIcon from '@material-ui/icons/FullscreenRounded';
import { StyleTooltip } from '../../dashboard.new/line.items/common/StyleTooltip';

const GridTable = Grid as React.ComponentType<GridProps<FBApprovalMatrixItem>>;

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { data, handleSave, disabled, withoutStatus } = props;
  const { approvalMatrix = [], approvalRoles = [] } = data ?? {};
  const classes = useStyles();

  const schema = createSchema({
    data,
    withoutStatus,
    clearRightBorderClassName: classes.clearRightBorder,
    cellARClassName: classes.cellAR,
    cellARHeaderClassName: classes.cellARHeader,
  });

  const defaultNewValue: GridProps<FBApprovalMatrixItem>['defaultNewValue'] = {
    docType: {
      name: '',
      group: FBDocTypeGroup.OTHER,
      active: true,
      acronym: '',
      category: '',
      needsSignature: false,
      defaultTraining: false,
    },
    approvalRoles: Object.keys(FBApprovalMatrixRoleTitles).reduce(
      (acc, key) => {
        acc[key] = new Array(approvalRoles.length).fill(false);
        return acc;
      },
      {},
    ) as FBApprovalRolesStages,
  };

  const renderTable = () => (
    <GridTable
      data={approvalMatrix}
      schema={schema}
      disabled={disabled}
      defaultNewValue={defaultNewValue}
      onSave={handleSave}
      withoutStatus={withoutStatus}
    />
  );

  const dialogState = FB.useRef(FBDialogState);
  const handleFullscreenClick = () => {
    dialogState.config({
      title: 'tabId.matrixdetails',
      content: renderTable(),
      open: true,
    });
  };

  return (
    <FBProvider dialogState={dialogState}>
      <FBDialog fullscreen />
      <StyleTooltip
        title={translate('form.builder.fullscreen.mode')}
        placement="top"
        arrow
      >
        <IconButton
          className={classes.buttonFullscreen}
          kind="ghost"
          data-cy="button-fullscreen"
          onClick={handleFullscreenClick}
        >
          <FullscreenIcon />
        </IconButton>
      </StyleTooltip>
      {renderTable()}
    </FBProvider>
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
