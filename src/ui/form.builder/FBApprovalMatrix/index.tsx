import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { v4 as generateUuid } from 'uuid';
import { FBApprovalMatrixItem, FBApprovalMatrixProps, FBApprovalMatrixRoleTitles, FBApprovalRolesStages, FBDocTypeGroup, FBGridTableContainerProps } from '..';
import { translate } from '../../../common/intl';
import { Dialog } from '../../components/dialogs';
import { IconButton } from '../../components/forms/fields-next';
import { StyleTooltip } from '../../dashboard.new/line.items/common/StyleTooltip';
import useDialog from '../../hooks/useDialog';
import Grid from './components/Grid';
import { GridProps } from './components/Grid/types';
import { DEFAULT_CATEGORY_LABEL } from './constants';
import createSchema from './schema';
import useStyles from './styles';
import { withFBApprovalMatrix } from './wrap';

const GridTable = Grid as React.ComponentType<GridProps<FBApprovalMatrixItem>>;

const FBGridTableContainer: React.FC<FBGridTableContainerProps> = ({
  isDialog,
  children,
  dialogContentStyle,
  onDialogClose,
},
) => {
  if (!isDialog) {
    return <>{children}</>;
  }
  return (
    <Dialog
      open
      fullScreen
      title="tabId.matrixdetails"
      onClose={onDialogClose}
      contentProps={{
        className: dialogContentStyle,
        dividers: true,
      }
      }
    >
      {children}
    </Dialog>
  );
};

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { data, handleSave, disabled, withoutStatus, size } = props;
  const { approvalMatrix = [], approvalRoles = [] } = data ?? {};
  const classes = useStyles();
  const dialog = useDialog();

  const schema = createSchema({
    data,
    withoutStatus,
    clearRightBorderClassName: classes.clearRightBorder,
    cellARClassName: classes.cellAR,
    cellARHeaderClassName: classes.cellARHeader,
  });

  const generateNewItem: GridProps<FBApprovalMatrixItem>['generateNewItem'] = () => ({
    id: generateUuid(),
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
  });

  approvalMatrix?.forEach((am) => {
    am.docType.updatedCategory = isEmpty(am.docType.category) ? DEFAULT_CATEGORY_LABEL : am.docType.category;
  });

  return (
    <Box
      className={classes.container}
      {...size && { height: size.height - 80 }}
    >
      <StyleTooltip
        title={translate('form.builder.fullscreen.mode')}
        placement="top"
        arrow
      >
        <IconButton
          className={classes.buttonFullscreen}
          kind="ghost"
          data-cy="button-fullscreen"
          onClick={dialog.open}
        >
          <FontAwesomeIcon icon={solid('expand')} />
        </IconButton>
      </StyleTooltip>
      <FBGridTableContainer
        isDialog={dialog.isOpen}
        dialogContentStyle={classes.dialogContentStyle}
        onDialogClose={dialog.close}
      >
        <GridTable
          data={approvalMatrix}
          schema={schema}
          disabled={disabled}
          generateNewItem={generateNewItem}
          onSave={handleSave}
          withoutStatus={withoutStatus}
        />
      </FBGridTableContainer>
    </Box>
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
