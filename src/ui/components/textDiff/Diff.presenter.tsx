import React from "react";
import ReactQuill from "react-quill";
import { styles } from "./Diff.styles";
import { DiffPresenterProps } from "./types.js";

type Props = DiffPresenterProps;

const DiffPresenter: React.FunctionComponent<Props> = ({
  oldText, newText, refOld, refNew, delta,
}) => {
  const classes = styles();

  return (
    <div>
      <ReactQuill
        ref={refOld}
        readOnly={true}
        value={oldText}
        modules={{ toolbar: false }}
        className={classes.editor}
      />
      <ReactQuill
        ref={refNew}
        readOnly={true}
        value={delta || newText}
        modules={{ toolbar: false }}
        className={classes.editor}
      />
    </div>
  );
}

DiffPresenter.displayName = "TextDiffPresenter";

export default DiffPresenter;
