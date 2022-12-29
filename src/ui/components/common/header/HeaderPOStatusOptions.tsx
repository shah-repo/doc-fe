import { Button, ButtonGroup, withStyles } from "@material-ui/core";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { default as classNames, default as cx } from "classnames";
import { default as React } from "react";
import { ReactComponent as CaretIcon } from "../../../../assets/images/leftPanel/po_status_dd.svg";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { POStatus } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../../ui/components/Text";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import useStyles from "./HeaderPOStatus.styles";

interface Props {
  status: string;
  docId: string;
}

const HeaderPOStatusOptions: React.FunctionComponent<Props> = ({
  status, docId,
}) => {
  const classes = useStyles();
  const dialog = useDialog();
  const async = useAsync();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVoid = () => {
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

  const getStatusIcon = (status) => (
    <div
      className={classNames(classes.statusIcon, {
        [classes.openStatusIcon]: status === POStatus.OPEN,
        [classes.closeStatusIcon]: status === POStatus.CLOSE,
        [classes.voidStatusIcon]: status === POStatus.VOID,
      })}
    />
  );

  const voidAction = useActionCreator(documentRevisionsActions.voidDocument);
  const voidDocument = () => {
    async.start(
      voidAction,
      docId,
      async,
    );
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
          <>{getStatusIcon("open")}</>
          <Text message="Open" />
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
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          <div
            className={classNames(classes.statusIcon, classes.closeStatusIcon)}
          />
          <Text message="Close" />
        </MenuItem>
        <MenuItem onClick={handleVoid} className={classes.menuItem}>
          <div
            className={classNames(classes.statusIcon, classes.voidStatusIcon)}
          />
          <Text message="Void" />
        </MenuItem>
      </StyledMenu>
      <AlertDialog
        confirmAction={voidDocument}
        message={"documentRevision.record.void.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default HeaderPOStatusOptions;
