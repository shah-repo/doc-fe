import { Button } from "@material-ui/core";
import React from "react";
import { userManagementActions } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import styles from "./styles";

interface DropboxResponse {
  code: number;
  status: string;
  data: {
    url: string;
  }[];
}

const EmployeeDropboxButton: React.FunctionComponent = () => {
  const classes = styles();
  // const isDropboxEnabled = useSelector(companySelectors.isDropboxEnabled);
  const enableDropboxAction = useActionCreator(userManagementActions.enableDropbox);

  const dropboxAsync = useAsync<DropboxResponse>({
    onSuccess: (data?: DropboxResponse) => {
      window.open(data?.data[0].url);
    },
  });

  const enableDropbox = () => {
    dropboxAsync.start(enableDropboxAction, dropboxAsync);
  };

  return (
    <Button
      variant="outlined"
      className={classes.button}
      onClick={enableDropbox}
      // disabled={isDropboxEnabled}
    >
      <Text translation="dropbox.enable" />
    </Button>
  );
};

export default EmployeeDropboxButton;
