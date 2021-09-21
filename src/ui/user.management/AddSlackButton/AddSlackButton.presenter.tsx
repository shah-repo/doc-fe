import { Button } from "@material-ui/core";
import React from "react";
import { ReactComponent as SlackLogo } from "../../../assets/images/slack_symbol_logo.svg";
import Text from "../../components/Text";
import styles from "./styles";

interface Props {
  addSlack: () => void;
}

const AddSlackButtonPresenter: React.FunctionComponent<Props> = ({
  addSlack,
}) => {
  const classes = styles();
  return (
    <Button
      onClick={addSlack}
      className={classes.slackButton}
      id="AddSlackButtonPresenter-slackButton"
    >
      <SlackLogo className={classes.slackLogo}/>
      <Text translation="slack.integrations.admin.add" />
    </Button>
  );
};

export default AddSlackButtonPresenter;
