import { Box } from "@material-ui/core";
import { concat, each, isEmpty, sum } from "lodash";
import React, { useEffect, useState } from "react";
import { Nullable } from "../../../../../../state/ducks/common/types";
import {
  DocumentRevision,
  SmartReference,
} from "../../../../../../state/ducks/documentRevisions/types";
import {
  isDocumentRevisionInDraft,
  isDocumentRevisionReleased,
} from "../../../../../../ui/documentRevision/helpers/documentRevisionStatus";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import { BorderLinearProgress } from "./BorderLinearProgress";

interface Props {
  smartReferencesFrom?: SmartReference[];
}

const DocumentRevisionFormProgressBar: React.FunctionComponent<Props> = ({
  smartReferencesFrom,
}) => {
  const [inprogress, setInprogress] = useState<number[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const getLHRStatus = (stepLHRs?: Nullable<DocumentRevision>) => {
    const status = stepLHRs?.status;
    let lhrstatus = "";
    if (stepLHRs && isDocumentRevisionReleased(status)) {
      lhrstatus = "complete";
    } else if (stepLHRs && isDocumentRevisionInDraft(status)) {
      lhrstatus = "inprogress";
    }
    return lhrstatus || status;
  };

  const prepareProgressBarData = () => {
    const inProgress: number[] = [];
    const complete: number[] = [];
    each(smartReferencesFrom, (e) => {
      e?.stepIndex &&
        (getLHRStatus(e?.fromDocRev) === "inprogress"
          ? inProgress.push(e.stepIndex)
          : complete.push(e.stepIndex));
    });
    setInprogress(inProgress);
    setCompleted(complete);
  };

  useEffect(() => {
    prepareProgressBarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartReferencesFrom]);

  return (
    <Box px={4.25}>
      {(!isEmpty(completed) || !isEmpty(inprogress)) && (
        <BorderLinearProgress
          variant="determinate"
          value={(completed.length / sum(concat(completed, inprogress))) * 100}
        />
      )}
      <Box
        component="div"
        fontSize={12}
        color={Colors.font_gray}
        mt={1.25}
        mb={2.125}
      >
        {!isEmpty(completed) && (
          <>
            <Box component="span" fontWeight={600}>
              Step {completed?.sort().map((e) => e + ",")}
            </Box>
            <Box component="span" fontWeight={400}>
              &nbsp;completed.&nbsp;
            </Box>
          </>
        )}
        {!isEmpty(inprogress) && (
          <>
            <Box component="span" fontWeight={600}>
              Step {inprogress?.sort().map((e) => e + ",")}
            </Box>
            <Box component="span" fontWeight={400}>
              &nbsp;in progress...
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DocumentRevisionFormProgressBar;
