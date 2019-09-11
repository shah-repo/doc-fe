import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { compareHandler } from "./helpers.js";
import DiffPresenter from "./Diff.presenter";

interface OwnProps {
  oldText: string;
  newText: string;
}

type Props = OwnProps;

const DiffContainer: React.FunctionComponent<Props> = ({
  oldText, newText,
}) => {
  const [delta, setDelta] = useState(null);
  const refOld = useRef<ReactQuill>(null);
  const refNew = useRef<ReactQuill>(null);
  useEffect(() => {
    refNew.current && refNew.current.getEditor().pasteHTML(newText);
    
    const oldContents = refOld.current && refOld.current.getEditor().getContents();
    const newContents = refNew.current && refNew.current.getEditor().getContents();
    const difference = compareHandler(oldContents, newContents);

    setDelta(difference);
  }, [newText]);

  return (
    <DiffPresenter
      oldText={oldText}
      newText={newText}
      refOld={refOld}
      refNew={refNew}
      delta={delta}
    />
  );
}

DiffContainer.displayName = "TextDiffContainer";

export default DiffContainer;
