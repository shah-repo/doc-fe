import { Button } from "@material-ui/core";
import React, { useMemo } from "react";
import Text from "../../../Text";
import { styles } from "../utils/styles";
import { ViewFileTitleControlsProps } from "../utils/types";

const ViewFileTitleControls: React.FunctionComponent<ViewFileTitleControlsProps> = ({
  attachment,
  attachments,
}) => {
  const { isPreviousDisabled, isNextDisabled } = useMemo(() => {
    const viewableFiles = attachments.filter((item) => item.id === attachment!.id);
    if (viewableFiles.length === 1) {
      return { isPreviousDisabled: true, isNextDisabled: true };
    }
    const currentIndex = attachments.findIndex((item) => item.id === attachment!.id);

    const disablePrevious = currentIndex === 0;
    const disableNext = (currentIndex - 1) === viewableFiles.length;

    return { isPreviousDisabled: disablePrevious, isNextDisabled: disableNext };
  }, [attachment, attachments]);
  const classes = styles();
  return (
    <span className={classes.buttonsContainer}>
      <Button
        color="secondary"
        variant="outlined"
        disabled={isPreviousDisabled}
      >
        <Text translation="common.previous" />
      </Button>
      <Button
        color="secondary"
        variant="contained"
        disabled={isNextDisabled}
      >
        <Text translation="common.next" />
      </Button>
    </span>
  );
};

export default ViewFileTitleControls;
