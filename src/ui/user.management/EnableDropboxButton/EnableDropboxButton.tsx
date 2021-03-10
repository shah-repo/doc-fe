import { Button } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { getHasPermission } from "../../../common/utils/selectors";
import { Permission } from "../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import styles from "./styles";

const EnableDropboxButton: React.FunctionComponent = () => {
  const classes = styles();
  const hasDropboxPermission = useSelector(getHasPermission(Permission.COMPANY_DROPBOX_INTEGRATION));
  const isDropboxEnabled = useSelector(companySelectors.isDropboxEnabled);
  const enableDropboxAction = useActionCreator(companyActions.enableDropbox);

  const dropboxAsync = useAsync();

  const enableDropbox = () => {
    dropboxAsync.start(enableDropboxAction, dropboxAsync);
  };

  if (!hasDropboxPermission) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      className={classes.button}
      onClick={enableDropbox}
      disabled={isDropboxEnabled}
    >
      <Text translation="dropbox.enable.company" />
    </Button>
  );
};

export default EnableDropboxButton;
