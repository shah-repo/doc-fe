// eslint-disable-next-line: no-implicit-dependencies
import { DeltaStatic } from "quill";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import DiffPresenter from "./Diff.presenter";
import { findDiff } from "./utils/helpers";
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
    if (oldText === "undefined" && refMain.current ) {
      const contents = refMain.current.getEditor().clipboard.convert(newText);
      refNew.current && refNew.current.getEditor().setContents(contents);
      return;
    }

    // TODO: remove component once ReactQuill abandoned
    const oldContents = refMain.current && refMain.current.getEditor().clipboard.convert(oldText);
    const newContents = refMain.current && refMain.current.getEditor().clipboard.convert(newText);

    if (oldContents && newContents) {
      const difference = findDiff(oldContents, newContents);
      setDelta(difference || null);
      refOld.current && refOld.current.getEditor().setContents(oldContents);
      refNew.current && refNew.current.getEditor().setContents(difference);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
