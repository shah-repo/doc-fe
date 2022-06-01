import { Box } from "@material-ui/core";
import { each } from "lodash";
import React from "react";
import {
  isDocumentRevisionInDraft,
  isDocumentRevisionReleased,
} from "../../../../../../ui/documentRevision/helpers/documentRevisionStatus";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import { BorderLinearProgress } from "./BorderLinearProgress";

const DocumentRevisionFormProgressBar = ({ smartReferencesFrom }) => {
  const statuses: string[] = [];
  const step: string[] = [];
  const resultInprogress: number[] = [];
  const resultCompleted: number[] = [];
  const getLHRStatus = (stepLHRs) => {
    const status = stepLHRs?.status;
    let lhrstatus = "";
    if (stepLHRs && isDocumentRevisionReleased(status)) {
      lhrstatus = "complete";
    } else if (stepLHRs && isDocumentRevisionInDraft(status)) {
      lhrstatus = "inprogress";
    }
    return lhrstatus || status;
  };

  const prepareProgressBarData = (smartRefs) => {
    each(smartRefs, (e) => {
      const lhrStep = e?.fromDocRev;
      statuses.push(getLHRStatus(lhrStep));
      const match = lhrStep?.name
        .split("Step")[1]
        .split("(")[0]
        .trim()
        .replaceAll("#", "");
      step.push(match);
    });
  };

  prepareProgressBarData(smartReferencesFrom);
  const data = [];
  step.forEach((element, index) => {
    data[element] = statuses[index];
  });
  data.forEach((status, index) =>
    status === "inprogress"
      ? resultInprogress.push(index)
      : resultCompleted.push(index)
  );

  return (
    <Box px={4.25}>
      {(resultCompleted.length > 0 || resultInprogress.length > 0) && (
        <BorderLinearProgress
          variant="determinate"
          value={resultCompleted.length / data.length}
        />
      )}
      <Box component="div" fontSize={12} color={Colors.font_gray} mt={1.25} mb={2.125}>
        {resultCompleted.length > 0 && (
          <>
            <Box component="span" fontWeight={600}>
              Step {resultCompleted?.map((e) => e)}
            </Box>
            <Box component="span" fontWeight={400}>
              &nbsp;completed.&nbsp;
            </Box>
          </>
        )}
        {resultInprogress.length > 0 && (
          <>
            <Box component="span" fontWeight={600}>
              Step {resultInprogress?.map((e) => e + ",")}
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
