import { Button, ButtonGroup, withStyles } from '@material-ui/core';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { default as classNames, default as cx } from 'classnames';
import { default as React } from 'react';
import { ReactComponent as CaretIcon } from '../../../../assets/images/po_status_dropdown.svg';
import { GroupTag } from '../../../../state/ducks/auth/types';
import { DocumentRevision, LotStatusLabelMapping, LotStatusType } from '../../../../state/ducks/documentRevisions/types';
import Text from '../../../../ui/components/Text';
import AlertDialog from '../../../app/alert.dialog/AlertDialog';
import useDialog from '../../../hooks/useDialog';
import useGetHasTag from '../../../hooks/useGetHasTag';
import useStyles from './HeaderPOStatus.styles';
import { VoidPOStatusDialog } from './VoidDialog';

interface Props {
  lotStatus: LotStatusType
  docId: string
  docRevOwner: string
  updatedAt: string
  isOwner: boolean
  documentRevision: DocumentRevision
}

const HeaderPOStatusOptions: React.FunctionComponent<Props> = ({
  lotStatus, docId, docRevOwner, updatedAt, isOwner, documentRevision,
}) => {
  const classes = useStyles();
  const dialog = useDialog();
  // const intl = useIntl();
  // const async = useAsync({
  //   onError: () => {
  //     toastError(intl.formatMessage({ id: 'documentRevision.lot.status.update.failed' }));
  //   },
  // });
  // const voidAction = useActionCreator(documentRevisionsActions.voidDocument);
  // const updatePOAction = useActionCreator(documentRevisionsActions.updatePO);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // LotStatus actions
  const [lotAction, setLotAction] = React.useState<LotStatusType>(LotStatusType.QUARANTINE);

  const isQuarantine = LotStatusType.QUARANTINE === lotAction;
  const isAccepted = LotStatusType.ACCEPTED === lotAction;
  const isRejected = LotStatusType.REJECTED === lotAction;
  const isExpired = LotStatusType.EXPIRED === lotAction;
  const isUseAsIs = LotStatusType.USE === lotAction;
  const isReturnToVendor = LotStatusType.RETURNVENDOR === lotAction;
  const isRework = LotStatusType.REWORK === lotAction;
  const isScrap = LotStatusType.SCRAP === lotAction;
  const isRAndDUsedOnly = LotStatusType.RNDONLY === lotAction;
  const isOther = LotStatusType.OTHER === lotAction;

  const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closePO = () => {
    dialog.close();
    handleClose();
    // async.start(updatePOAction, docId, { poStatus: POStatusType.CLOSED }, async);
  };

  const handleVoid = () => {
    // setAction(POStatusType.VOIDED);
    dialog.open();
    handleClose();
  };

  const handleOpen = () => {
    // setAction(POStatusType.OPENED);
    setLotAction(lotStatus);
    dialog.open();
    handleClose();
  };

  const handleLotStatus = (lotStatus) => {
    setLotAction(lotStatus);
    dialog.open();
    handleClose();
  };

  console.log(closePO, handleVoid, handleOpen);

  const StyledMenu = withStyles({
    list: {
      padding: 0,
    },
  })((props: MenuProps) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 94,
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 94,
      }}
      {...props}
    />
  ));
  const getPOStatusMenuItemLabel = (lotStatus: LotStatusType) => {
    let label = 'form.builder.header.lot.status.quarantine';
    switch (lotStatus) {
      case LotStatusType.ACCEPTED:
        label = 'form.builder.header.lot.status.accepted';
        break;
      case LotStatusType.REJECTED:
        label = 'form.builder.header.lot.status.rejected';
        break;
      case LotStatusType.EXPIRED:
        label = 'form.builder.header.lot.status.expired';
        break;
      case LotStatusType.USE:
        label = 'form.builder.header.lot.status.use.as.is';
        break;
      case LotStatusType.RETURNVENDOR:
        label = 'form.builder.header.lot.status.return.to.vendor';
        break;
      case LotStatusType.REWORK:
        label = 'form.builder.header.lot.status.rework';
        break;
      case LotStatusType.SCRAP:
        label = 'form.builder.header.lot.status.scrap';
        break;
      case LotStatusType.RNDONLY:
        label = 'form.builder.header.lot.status.rnd.used.only';
        break;
      case LotStatusType.OTHER:
        label = 'form.builder.header.lot.status.other';
        break;
      default:
        break;
    }
    return label;
  };

  const getPOStatusMenuItem = (status: LotStatusType) => (
    <>
      <div className={classNames(classes.statusIcon)} />
      <Text message={getPOStatusMenuItemLabel(status)} />
    </>
  );

  const getMenuOptions = (lotStatus) => (
    <>
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.ACCEPTED)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.ACCEPTED)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.USE)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.USE)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.REJECTED)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.REJECTED)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.EXPIRED)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.EXPIRED)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.QUARANTINE)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.QUARANTINE)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.RETURNVENDOR)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.RETURNVENDOR)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.REWORK)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.REWORK)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.SCRAP)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.SCRAP)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.OTHER)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.OTHER)}
        </MenuItem>
      )}
      {lotStatus === LotStatusType.QUARANTINE && (
        <MenuItem onClick={() => handleLotStatus(LotStatusType.RNDONLY)} className={classes.menuItem}>
          {getPOStatusMenuItem(LotStatusType.RNDONLY)}
        </MenuItem>
      )}
    </>
  );

  const confirmAction = () => {
    dialog.close();
    // if (isVoidedAction) {
    //   async.start(voidAction, docId, async);
    // } else if (isOpenedAction) {
    //   async.start(updatePOAction, docId, { poStatus: POStatusType.OPENED }, async);
    // }
  };
  const confirmLotStatusAction = (lotAction) => {
    switch (lotAction) {
      case isQuarantine:
        console.log('isQuarantine');
        break;
      case isAccepted:
        console.log('isAccepted');
        break;
      case isRejected:
        console.log('isRejected');
        break;
      case isExpired:
        console.log('isExpired');
        break;
      case isUseAsIs:
        console.log('isUseAsIs');
        break;
      case isReturnToVendor:
        console.log('isReturnToVendor');
        break;
      case isRework:
        console.log('isRework');
        break;
      case isScrap:
        console.log('isScrap');
        break;
      case isRAndDUsedOnly:
        console.log('isRAndDUsedOnly');
        break;
      case isOther:
        console.log('isOther');
        break;
      default:
        console.log('Unknown lotAction');
        break;
    }
    dialog.close();
  };

  return (
    <>
      <ButtonGroup
        disableRipple
        aria-label="split button"
        className={classes.buttonGroup}
        disabled={isUserAdminEnforce ? !isUserAdminEnforce : !isOwner}
      >
        <Button
          type="submit"
          className={cx(classes.defaultGroupButton, classes.textBtn)}
          disableRipple
          onClick={handleClick}
        >
          <div className={classNames(classes.statusIcon)} />
          <Text message={LotStatusLabelMapping[lotStatus]} />
        </Button>
        <Button
          onClick={handleClick}
          aria-owns={anchorEl ? 'po-status-menu' : undefined}
          aria-haspopup="true"
          className={cx(classes.defaultGroupButton, classes.iconBtn)}
        >
          <CaretIcon />
        </Button>
      </ButtonGroup>
      <StyledMenu
        id="po-status-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        className={classes.menu}
      >
        {getMenuOptions(lotStatus)}
      </StyledMenu>
      {isQuarantine && (
        <AlertDialog
          confirmAction={confirmAction}
          message="documentRevision.po.open.alert"
          {...{ dialog }}
        />
      )}
      {
        lotAction && (
          <AlertDialog
            confirmAction={() => confirmLotStatusAction(lotAction)}
            message = {lotAction}
            {...{ dialog }}
          />
        )
      }
      {isQuarantine && (
        <VoidPOStatusDialog
          docRevId={docId}
          docRevOwner={docRevOwner}
          {...{ dialog }}
        />
      )}
    </>
  );
};

export default HeaderPOStatusOptions;
