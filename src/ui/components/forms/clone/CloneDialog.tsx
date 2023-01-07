import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as ModelCloseIcon } from "../../../../assets/images/modelClose.svg";
import { ReactComponent as Active } from "../../../../assets/images/radioActive.svg";
import { ReactComponent as InActive } from "../../../../assets/images/radioInActive.svg";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../components/Text";
import { documentVersionPath } from "../../../document.revision/utils/paths";
import FBStore from "../../../form.builder/FBStore/FBStore";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { styles } from "./CloneModal.styles";

interface CloneModalProps {
  handleCloneModelClose: () => void;
  documentRevision: DocumentRevision;
}

const CloneModal: React.FunctionComponent<CloneModalProps> = ({
  handleCloneModelClose,
  documentRevision,
}) => {
  const classes = styles();
  const [value, setValue] = React.useState("false");
  const cloneEB = useActionCreator(documentRevisionsActions.cloneDoc);
  const history = useHistory();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const asyncClone = useAsync({
    onSuccess: (documentRevision: any) => {
      history.push({
        pathname: documentVersionPath(
          documentRevision.id,
          documentRevision.document.id
        ),
      });
    },
  });

  const payload = {
    decoupleEB: value === "true",
  };

  const cloneAction = () => {
    FBStore.selectedApprover = [];
    asyncClone.start(cloneEB, documentRevision.id, { ...payload }, asyncClone);
  };

  return (
    <Box
      pt={0}
      pl={2.5}
      pb={1.875}
      pr={2.5}
      alignItems="flex-start"
      className={classes.paper}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.header}
      >
        <Grid item>
          <Typography
            variant="h2"
            component="h2"
            className={`${classes.headertitle} ${classes.title}`}
          >
            <Text translation="documentRevision.clone.modal.title" />
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            className={classes.closemodel}
            onClick={handleCloneModelClose}
          >
            <ModelCloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box>
        <Typography
          variant="h2"
          component="h2"
          className={`${classes.contenttitle} ${classes.title}`}
        >
          <Text translation="documentRevision.clone.eb.title" />
        </Typography>
        <RadioGroup value={value} onChange={handleChange}>
          <FormControlLabel
            value={"false"}
            control={
              <Radio
                classes={{ root: classes.radio, checked: classes.checked }}
                checkedIcon={<Active />}
                icon={<InActive />}
                disableRipple
              />
            }
            label={
              <Typography variant="body2" className={classes.radioLabel}>
                <Text translation="common.true" />
              </Typography>
            }
          />
          <FormControlLabel
            value={"true"}
            control={
              <Radio
                classes={{ root: classes.radio, checked: classes.checked }}
                checkedIcon={<Active />}
                icon={<InActive />}
                disableRipple
              />
            }
            label={
              <Typography variant="body2" className={classes.radioLabel}>
                <Text translation="common.false" />
              </Typography>
            }
          />
        </RadioGroup>
      </Box>
      <Box className={classes.footer}>
        <Button
          variant="contained"
          onClick={handleCloneModelClose}
          className={`${classes.buttonCancel} ${classes.buttonLabel}`}
          disableFocusRipple
          disableRipple
        >
          <Text translation="common.cancel" />
        </Button>
        <Button
          variant="contained"
          onClick={cloneAction}
          data-cy="CloneContinue"
          className={`${classes.buttonContinue} ${classes.buttonLabel}`}
        >
          <Text translation="common.continue" />
        </Button>
      </Box>
    </Box>
  );
};
export default CloneModal;
