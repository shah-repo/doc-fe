import { Button, ButtonGroup, withStyles } from "@material-ui/core";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { default as classNames, default as cx } from "classnames";
import { default as React } from "react";
import { useIntl } from "react-intl";
import { ReactComponent as CaretIcon } from "../../../../assets/images/po_status_dropdown.svg";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { POStatusLabelMapping, POStatusType } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../../ui/components/Text";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import useGetHasTag from "../../../hooks/useGetHasTag";
import { toastError } from "../../notifications";
import useStyles from "./HeaderPOStatus.styles";
import { VoidPOStatusDialog } from "./VoidDialog";

interface Props {
  poStatus: POStatusType;
  docId: string;
  docRevOwner: string;
  updatedAt: string;
  isOwner: boolean;
}

const HeaderPOStatusOptions: React.FunctionComponent<Props> = ({
  poStatus, docId, docRevOwner, updatedAt, isOwner,
}) => {
  const classes = useStyles();
  const dialog = useDialog();
  const intl = useIntl();
  const async = useAsync({
    onError: () => {
      toastError(intl.formatMessage({ id: "documentRevision.po.status.update.failed" }));
    },
  });
  const voidAction = useActionCreator(documentRevisionsActions.voidDocument);
  const updatePOAction = useActionCreator(documentRevisionsActions.updatePO);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [action, setAction] = React.useState<POStatusType>(POStatusType.OPENED);
  const isVoidedAction = POStatusType.VOIDED === action;
  const isOpenedAction = POStatusType.OPENED === action;
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
    async.start(updatePOAction, docId, { poStatus: POStatusType.CLOSED }, async);
  };

  const handleVoid = () => {
    setAction(POStatusType.VOIDED);
    dialog.open();
    handleClose();
  };

  const handleOpen = () => {
    setAction(POStatusType.OPENED);
    dialog.open();
    handleClose();
  };

  const StyledMenu = withStyles({
    list: {
      padding: 0,
    },
  })((props: MenuProps) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: 94,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: 94,
      }}
      {...props}
    />
  ));
  const getPOStatusMenuItemLabel = (poStatus) => {
    let label = "form.builder.header.po.status.open";
    switch (poStatus) {
      case POStatusType.CLOSED:
        label = "form.builder.header.po.status.close";
        break;
      case POStatusType.VOIDED:
        label = "form.builder.header.po.status.void";
        break;
      default:
    }
    return label;
  };

  const getPOStatusMenuItem = (status) => <>
    <div
      className={classNames(classes.statusIcon, classes[status])}
    />
    <Text message={getPOStatusMenuItemLabel(POStatusType[status])} />
  </>;


  const getMenuOptions = () => (
    <>
      {poStatus === POStatusType.CLOSED && (
        <MenuItem data-cy="po-status-menu-opened" onClick={handleOpen} className={classes.menuItem}>
          {getPOStatusMenuItem(POStatusType.OPENED)}
        </MenuItem>
      )}
      {poStatus === POStatusType.OPENED && (
        <MenuItem data-cy="po-status-menu-closed" onClick={closePO} className={classes.menuItem}>
          {getPOStatusMenuItem(POStatusType.CLOSED)}
        </MenuItem>
      )}
      {poStatus === POStatusType.OPENED && (
        <MenuItem data-cy="po-status-menu-voided" onClick={handleVoid} className={classes.menuItem}>
          {getPOStatusMenuItem(POStatusType.VOIDED)}
        </MenuItem>
      )}
    </>
  );

  const confirmAction = () => {
    dialog.close();
    if (isVoidedAction) {
      async.start(voidAction, docId, async);
    } else if (isOpenedAction) {
      async.start(updatePOAction, docId, { poStatus: POStatusType.OPENED }, async);
    }
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
          data-cy={`po-status-button-${poStatus}`}
          className={cx(classes.defaultGroupButton, classes.textBtn)}
          disableRipple
          onClick={handleClick}
        >
          <div className={classNames(classes.statusIcon, classes[poStatus])}/>
          <Text message={POStatusLabelMapping[poStatus]} />
        </Button>
        <Button
          onClick={handleClick}
          data-cy="po-status-menu"
          aria-owns={anchorEl ? "po-status-menu" : undefined}
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
          vertical: "bottom",
          horizontal: "center",
        }}
        className={classes.menu}
      >
        {getMenuOptions()}
      </StyledMenu>
      {isOpenedAction && (
        <AlertDialog
          confirmAction={confirmAction}
          message="documentRevision.po.open.alert"
          {...{ dialog }}
        />
      )}
      {isVoidedAction && (
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
