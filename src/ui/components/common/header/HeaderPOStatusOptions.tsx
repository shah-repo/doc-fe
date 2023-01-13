import { Button, ButtonGroup, withStyles } from "@material-ui/core";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { default as classNames, default as cx } from "classnames";
import { default as React } from "react";
import { ReactComponent as CaretIcon } from "../../../../assets/images/po_status_dropdown.svg";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { POStatusType } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../../ui/components/Text";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { Translation } from "../../../translations/types";
import { openPOToast } from "../../notifications/POStatus";
import useStyles from "./HeaderPOStatus.styles";
import { getPOStatusLabel } from "./Helpers";

interface Props {
  poStatus: POStatusType;
  docId: string;
}

const HeaderPOStatusOptions: React.FunctionComponent<Props> = ({
  poStatus, docId,
}) => {
  const classes = useStyles();
  const dialog = useDialog();
  const async = useAsync();
  const voidAction = useActionCreator(documentRevisionsActions.voidDocument);
  const openPOAction = useActionCreator(documentRevisionsActions.openPO);
  const closePOAction = useActionCreator(documentRevisionsActions.closePO);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [action, setAction] = React.useState<POStatusType>(POStatusType.OPENED);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closePO = () => {
    dialog.close();
    async.start(closePOAction, docId, async);
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

  const getPOStatusMenuItem = (status) => <>
    <div
      className={classNames(classes.statusIcon, classes[status])}
    />
    <Text message={getPOStatusLabel(POStatusType[status], true)} />
  </>;


  const getMenuOptions = () => (
    <>
      {poStatus === POStatusType.CLOSED && (
        <MenuItem onClick={handleOpen} className={classes.menuItem}>
          {getPOStatusMenuItem(POStatusType.OPENED)}
        </MenuItem>
      )}
      {poStatus === POStatusType.OPENED && (
        <MenuItem onClick={closePO} className={classes.menuItem}>
          {getPOStatusMenuItem(POStatusType.CLOSED)}
        </MenuItem>
      )}
      {poStatus === POStatusType.OPENED && (
        <MenuItem onClick={handleVoid} className={classes.menuItem}>
          {getPOStatusMenuItem(POStatusType.VOIDED)}
        </MenuItem>
      )}
    </>
  );

  const confirmAction = () => {
    dialog.close();
    if (action === POStatusType.VOIDED) {
      openPOToast("Show me ");
    } else if (action === POStatusType.OPENED) {
      async.start(openPOAction, docId, async);
      async.start(voidAction, docId, async);
    }
  };
  const getAlertDialogMessage = () => {
    if (action === POStatusType.VOIDED) {
      return "documentRevision.record.void.alert";
    } else if (action === POStatusType.OPENED) {
      return "documentRevision.record.open.alert";
    }
  };

  return (
    <>
      <ButtonGroup
        disableRipple
        aria-label="split button"
        className={classes.buttonGroup}
      >
        <Button
          type="submit"
          className={cx(classes.defaultGroupButton, classes.textBtn)}
          disableRipple
          onClick={handleClick}
        >
          <div className={classNames(classes.statusIcon, classes[poStatus])}/>
          <Text message={getPOStatusLabel(poStatus)} />
        </Button>
        <Button
          onClick={handleClick}
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
      <AlertDialog
        confirmAction={confirmAction}
        message={getAlertDialogMessage() as Translation}
        {...{ dialog }}
      />
    </>
  );
};

export default HeaderPOStatusOptions;
