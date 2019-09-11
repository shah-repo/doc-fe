import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { compareHandler } from "./helpers.js";
import { styles } from "./Diff.styles";

interface OwnProps {
  oldText: string;
  newText: string;
}

type Props = OwnProps;

const Diff: React.FunctionComponent<Props> = ({
  oldText, newText,
}) => {
  const classes = styles();
  const [newDelta, setNewDelta] = useState(null);
  const refOld = useRef<ReactQuill>(null);
  const refNew = useRef<ReactQuill>(null);
  useEffect(() => {
    refNew.current && refNew.current.getEditor().pasteHTML(newText);
    
    const oldContents = refOld.current && refOld.current.getEditor().getContents();
    const newContents = refNew.current && refNew.current.getEditor().getContents();
    const difference = compareHandler(oldContents, newContents);

    setNewDelta(difference);
  }, [newText]);

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
        value={newDelta || newText}
        modules={{ toolbar: false }}
        className={classes.editor}
      />
    </div>
  );
}

Diff.displayName = "TextDiff";

export default Diff;
