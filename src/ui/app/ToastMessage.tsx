import Button from "@material-ui/core/Button";
import React from "react";
import Text from "../components/Text";
import { styles } from "./ToastMessage.styles";

interface MsgProps {
  message: string;
}

const ToastMessage: React.FunctionComponent<MsgProps> = ({ message }) => {
  const classes = styles();
  return (
    <div>
      <div className={classes.refreshLink}>
        {message}
      </div>
      <Button
        color="primary"
        onClick={() => window.location.reload(false)}
        className={classes.buttonStyle}
      >
        <Text translation="mqtt.refresh.page" />
      </Button>
    </div>
  );
};

export default ToastMessage;
