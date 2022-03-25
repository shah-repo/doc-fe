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
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { ReactComponent as ModelCloseIcon } from "../../../../assets/images/modelClose.svg";
import { ReactComponent as Active } from "../../../../assets/images/radioActive.svg";
import { ReactComponent as InActive } from "../../../../assets/images/radioInActive.svg";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../components/Text";
import { documentVersionPath } from "../../../document.revision/utils/paths";
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
  const intl = useIntl();
  const [value, setValue] = React.useState("false");
  const cloneEB = useActionCreator(documentRevisionsActions.cloneEB);
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
    decoupleEB: value === "true" ? true : false,
  };

  const cloneAction = () => {
    asyncClone.start(cloneEB, documentRevision.id, { ...payload }, asyncClone);
  };

  return (
    <Box component="div" className={classes.paper}>
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
            id="simple-modal-title"
            className={`${classes.headertitle} ${classes.title}`}
          >
            <Text translation="documentRevision.clone.modal.title" />
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="close"
            className={classes.closemodel}
            onClick={handleCloneModelClose}
          >
            <ModelCloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box component="div" className={classes.content}>
        <Typography
          variant="h2"
          component="h2"
          id="simple-modal-title"
          className={`${classes.contenttitle} ${classes.title}`}
        >
          <Text translation="documentRevision.clone.eb.title" />
        </Typography>
        <RadioGroup
          aria-label="cloneEB"
          name="cloneEB1"
          value={value}
          onChange={handleChange}
        >
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
                {intl.formatMessage({ id: "common.true" })}
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
                {intl.formatMessage({ id: "common.false" })}
              </Typography>
            }
          />
        </RadioGroup>
      </Box>
      <Box component="div" className={classes.footer}>
        <Button
          variant="contained"
          className={`${classes.buttonCancel} ${classes.buttonLabel}`}
          disableFocusRipple={true}
          disableRipple={true}
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
