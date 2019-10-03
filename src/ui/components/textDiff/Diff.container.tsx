import { DeltaStatic } from "quill";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import DiffPresenter from "./Diff.presenter";
import { compareHandler } from "./utils/helpers";
import { DiffContainerProps } from "./utils/types";

type Props = DiffContainerProps;

const DiffContainer: React.FunctionComponent<Props> = ({
  oldText, newText,
}) => {
  const [delta, setDelta] = useState<DeltaStatic | null>(null);
  const refOld = useRef<ReactQuill>(null);
  const refNew = useRef<ReactQuill>(null);
  const refMain = useRef<ReactQuill>(null);
  useEffect(() => {
    if (!oldText || !newText) {
      return;
    }
    if (oldText === "undefined") {
      const contents = refMain.current!.getEditor().clipboard.convert(newText);
      refNew.current!.getEditor().setContents(contents);
      return;
    }

    const oldContents = refMain.current!.getEditor().clipboard.convert(oldText);
    const newContents = refMain.current!.getEditor().clipboard.convert(newText);

    if (oldContents && newContents) {
      const difference = compareHandler(oldContents, newContents);
      setDelta(difference || null);
      refOld.current!.getEditor().setContents(oldContents);
      refNew.current!.getEditor().setContents(difference as DeltaStatic);
    }
  }, [newText]);

  return (
    <DiffPresenter
      refOld={refOld}
      refNew={refNew}
      refMain={refMain}
      delta={delta}
    />
  );
};

DiffContainer.displayName = "TextDiffContainer";

export default DiffContainer;
