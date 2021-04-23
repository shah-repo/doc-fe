import { Button } from "@material-ui/core";
import React from "react";
import { ActionCreator } from "redux";
import { ApiAction } from "../../../state/types";
import Text from "../../components/Text";

interface Props {
  shouldDisplayButton: boolean;
  dropboxAsync: any;
  enableDropboxAction: ActionCreator<ApiAction<any, any>>;
  disabled: boolean;
}

const EnableDropboxButton: React.FunctionComponent<Props> = ({
  shouldDisplayButton,
  dropboxAsync,
  enableDropboxAction,
  disabled,
}) => {

  const enableDropbox = () => {
    dropboxAsync.start(enableDropboxAction, dropboxAsync);
  };

  if (!shouldDisplayButton) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={enableDropbox}
      {...{ disabled }}
    >
      <Text translation="dropbox.enable" />
    </Button>
  );
};

export default EnableDropboxButton;
