import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as generateUuid } from 'uuid';
import { FB, FBApprovalMatrixItem, FBApprovalMatrixProps, FBApprovalMatrixRoleTitles, FBApprovalRolesStages, FBDocTypeGroup, FBGridTableContainerProps } from '..';
import { translate } from '../../../common/intl';
import { AsyncStatus } from '../../../state/types';
import Loader from '../../components/common/kendo/Loader';
import { Dialog } from '../../components/dialogs';
import { IconButton } from '../../components/forms/fields-next';
import { StyleTooltip } from '../../dashboard.new/line.items/common/StyleTooltip';
import { FormHeaderContext } from '../../documentRevision/forms/DocumentRevisionForm.container';
import useDialog from '../../hooks/useDialog';
import useTableCriteria from '../FBApprovalMatrixRoles/utils';
import { DamRestrictionsProvider } from './components/DamNumberingStyle/DamRestrictionsContext';
import { useDamNumberingStyleRestrictions } from './components/DamNumberingStyle/useDamNumberingStyleRestrictions';
import ExportDAMDialog from './components/ExportUtils/ExportDAMDialog';
import Grid from './components/Grid';
import { GridProps } from './components/Grid/types';
import { APPROVAL_MATRIX_TABLE_NAME } from './constants';
import createSchema from './schema';
import useStyles from './styles';
import { withFBApprovalMatrix } from './wrap';

const GridTable = Grid as React.ComponentType<GridProps<FBApprovalMatrixItem>>;

const FBGridTableContainer: React.FC<FBGridTableContainerProps> = ({
  isDialog,
  children,
  dialogContentStyle,
  onDialogClose,
  popupContainerRef,
},
) => {
  const classes = useStyles();
  if (!isDialog) {
    return <>{children}</>;
  }
  return (
    <Dialog
      open
      fullScreen
      title="tabId.matrixdetails"
      onClose={onDialogClose}
      PaperProps={{
        className: classes.dialogPaper,
      }}
      contentProps={{
        className: dialogContentStyle,
        dividers: true,
      }
      }
    >
      <div ref={popupContainerRef} />
      {children}
    </Dialog>
  );
};

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { asyncState } = React.useContext(FormHeaderContext) ?? {};
  const { workspaceState } = FB.useStores();
  const exportDialog = useDialog();
  const popupContainerRef = React.useRef<HTMLDivElement>(null);
  const { data, handleSave, disabled, withoutStatus, size } = props;
  const { approvalMatrix = [], approvalRoles = [] } = data ?? {};
  const classes = useStyles();
  const dialog = useDialog();

  const location = useLocation();
  const isNewVersion: boolean = location.pathname.includes('new-version');

  const { dataState, dataStateChange } = useTableCriteria(APPROVAL_MATRIX_TABLE_NAME);
  const { restrictions, isRestrictionsLoading } = useDamNumberingStyleRestrictions();
  const isLoading = useObserver(
    () => asyncState?.status === AsyncStatus.Active || workspaceState?.documentRevApi.loading || isRestrictionsLoading,
  );

  const schema = useMemo(
    () =>
      createSchema({
        data,
        withoutStatus,
        clearRightBorderClassName: classes.clearRightBorder,
        cellARClassName: classes.cellAR,
        cellARHeaderClassName: classes.cellARHeader,
        popupContainer: popupContainerRef,
      }),
    [approvalMatrix, approvalRoles, withoutStatus, classes.clearRightBorder, classes.cellAR, classes.cellARHeader],
  );

  const generateNewItem: GridProps<FBApprovalMatrixItem>['generateNewItem'] = useCallback(() => ({
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
  }), [approvalRoles.length]);

  return (
    <Box
      className={classes.container}
      {...size && { height: size.height - 80 }}
    >
      <Box className={classes.iconContainer}>
        <StyleTooltip
          title={translate('form.builder.export.dam.ar')}
          placement="top"
          arrow
        >
          <IconButton
            className={classes.buttonFullscreen}
            kind="ghost"
            data-cy="button-export-dam"
            onClick={exportDialog.open}
          >
            <FontAwesomeIcon icon={solid('arrow-down-to-line')} />
          </IconButton>
        </StyleTooltip>
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
      </Box>
      <DamRestrictionsProvider value={{ restrictions }}>
        <FBGridTableContainer
          isDialog={dialog.isOpen}
          dialogContentStyle={classes.dialogContentStyle}
          onDialogClose={dialog.close}
          popupContainerRef={popupContainerRef}
        >
          {isLoading && <Loader />}
          <GridTable
            data={approvalMatrix}
            schema={schema}
            disabled={disabled || isNewVersion}
            generateNewItem={generateNewItem}
            onSave={handleSave}
            withoutStatus={withoutStatus}
            isLoading={isLoading}
            {...dataState}
            onDataStateChange={dataStateChange}
          />
        </FBGridTableContainer>
      </DamRestrictionsProvider>
      <ExportDAMDialog dialog={exportDialog} matrixTabDataState={dataState} />
    </Box>
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
