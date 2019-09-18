import { Button } from "@material-ui/core";
import React, { useContext, useMemo } from "react";
import Text from "../../../Text";
import { SetFile } from "../../attachment.icon/container";
import { VIEWABLE_FILES } from "../utils/constants";
import { styles } from "../utils/styles";
import { ViewFileTitleControlsProps } from "../utils/types";

const ViewFileTitleControls: React.FunctionComponent<ViewFileTitleControlsProps> = ({
  attachment,
  attachments,
}) => {
  const setFile = useContext(SetFile);
  const { setPreviousAttachment, setNextAttachment } = useMemo(() => {
    const viewableFiles = attachments.filter((item) => VIEWABLE_FILES.includes(item.type));
    if (viewableFiles.length === 1) {
      return { setPreviousAttachment: undefined, setNextAttachment: undefined };
    }
    const currentIndex = viewableFiles.findIndex((item) => item.id === attachment!.id);

    const setPrevious = currentIndex === 0
      ? undefined
      : () => setFile(viewableFiles[currentIndex - 1]);
    const setNext = (currentIndex + 1) >= viewableFiles.length
      ? undefined
      : () => setFile(viewableFiles[currentIndex + 1]);

    return { setPreviousAttachment: setPrevious, setNextAttachment: setNext };
  }, [attachment, attachments]);
  const classes = styles();
  return (
    <span className={classes.buttonsContainer}>
      <Button
        color="secondary"
        variant="outlined"
        disabled={!setPreviousAttachment}
        onClick={setPreviousAttachment}
      >
        <Text translation="common.previous" />
      </Button>
      <Button
        color="secondary"
        variant="contained"
        disabled={!setNextAttachment}
        onClick={setNextAttachment}
      >
        <Text translation="common.next" />
      </Button>
    </span>
  );
};

export default ViewFileTitleControls;
