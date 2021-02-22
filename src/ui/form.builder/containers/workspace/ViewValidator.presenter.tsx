import { AppBar, Box, Dialog, Toolbar, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../../components/Text";
import { FBTemplateSchema } from "../../types/store";
import FBSortableContainer from "./FBSortableContainer";
import styles from "./styles";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
  schema: FBTemplateSchema[];
}

const ViewValidatorPresenter: React.FunctionComponent<Props> = ({
  isOpen,
  closeDialog,
  schema,
}) => {
  const classes = styles();

  return (
    <Dialog fullScreen={true} open={isOpen}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton color="default" onClick={closeDialog} aria-label="Close" id="ViewValidator-closeDialog" >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.dialogTitle}>
            <Text message="form.builder.form.preview" />
          </Typography>
        </Toolbar>
        <div className={classes.schemaContainer} >
          <Box width={500}>
            <FBSortableContainer items={schema} />
          </Box>
        </div>
      </AppBar>
    </Dialog>
  );
};

export default ViewValidatorPresenter;
