import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { ActionCreator } from "redux";
import { ApiAction } from "../../../state/types";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";

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
  const styles = makeStyles(() => ({
    Button: {
      borderRadius: 100,
      marginRight: 15,
      textTransform: "none",
      paddingRight: 20,
      paddingLeft: 20,
      fontFamily: "Sora",
      fontSize: 12,
      fontWeight: 600,
      color: Colors.navy,
      border: `1px solid ${Colors.navy}`,
      backgroundColor: Colors.white,
      marginTop: 0,
    },
  }));
  const classes = styles();

  const enableDropbox = () => {
    dropboxAsync.start(enableDropboxAction, dropboxAsync);
  };

  if (!shouldDisplayButton) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      className={classes.Button}
      onClick={enableDropbox}
      {...{ disabled }}
    >
      <Text translation="dropbox.enable" />
    </Button>
  );
};

export default EnableDropboxButton;
