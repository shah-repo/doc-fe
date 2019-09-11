import React, { RefObject } from "react";
import ReactQuill from "react-quill";
import { compareHandler } from "./helpers.js";
import { styles } from "./Diff.styles";

interface OwnProps {
  oldText: string;
  newText: string;
  refOld: RefObject<ReactQuill>;
  refNew: RefObject<ReactQuill>;
  delta: any;
}

type Props = OwnProps;

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
