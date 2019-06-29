import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { Translation } from "../../translations/types";
import Text from "../Text";
import styles from "./Dialog.styles";
import { DialogAction, DialogResponsiveProps } from "./utils/types";

type Props =  DialogResponsiveProps & WithStyles<typeof styles>;

const DialogWindow: React.FunctionComponent<Props> = ({
  classes,
  breakpoint = "xs",
  title,
  contentRenderer,
  actions,
  onActionClick,
  dialogHandler,
}) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down(breakpoint));

  const handleAction = (type: DialogAction) => () => {
    if (onActionClick) {
      onActionClick!(type);
    }
    dialogHandler.close();
  };

  const titleRenderer = () => (
    <DialogTitle>
      <Text translation={title} />
    </DialogTitle>
  );

  const actionsRenderer = () => (
    <DialogActions>
      {actions!.map((type) => actionRenderer(type))}
    </DialogActions>
  );

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();

  const actionRenderer = (type: DialogAction) => (
    <Button key={type} onClick={handleAction(type)} color="primary">
      <Text translation={type as Translation} />
    </Button>
  );

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={dialogHandler.isOpen}
        onClose={dialogHandler.close}
        onSubmit={preventPropagation}
      >
        <IconButton className={classes.closeButton} onClick={dialogHandler.close}>
          <CloseIcon />
        </IconButton>
        {title && titleRenderer()}
        <DialogContent>
          {contentRenderer && contentRenderer()}
        </DialogContent>
        {actions && actionsRenderer()}
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(DialogWindow);
