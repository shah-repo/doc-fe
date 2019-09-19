import { Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import ReactQuill from "react-quill";
import Text from "../../components/Text";
import { styles } from "./utils/Diff.styles";
import { DiffPresenterProps } from "./utils/types.js";

type Props = DiffPresenterProps;

const DiffPresenter: React.FunctionComponent<Props> = ({
  oldText, newText, refOld, refNew, delta,
}) => {
  const classes = styles();

  return (
    <div className="diff-container">
      <div
        className={classNames(classes.editorContainer, { [classes.hiddenEditor]: !delta })}
      >
        <Typography className={classes.font}>
          <Text translation="common.original" />
        </Typography>
        <ReactQuill
          ref={refOld}
          readOnly={true}
          value={oldText}
          modules={{ toolbar: false }}
          className={classNames(classes.editor, { [classes.hiddenEditor]: !delta })}
        />
      </div>
      <div
        className={classNames(classes.editorContainer, { [classes.fullWidth]: !delta })}
      >
        <Typography className={classes.font}>
          <Text translation="common.updated" />
        </Typography>
        <ReactQuill
          ref={refNew}
          readOnly={true}
          value={delta || newText}
          modules={{ toolbar: false }}
          className={classNames(classes.editor, { [classes.fullWidth]: !delta })}
        />
      </div>
    </div>
  );
};

DiffPresenter.displayName = "TextDiffPresenter";

export default DiffPresenter;
