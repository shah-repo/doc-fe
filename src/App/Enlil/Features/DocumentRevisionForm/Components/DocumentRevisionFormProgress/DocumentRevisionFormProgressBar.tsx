import { Box, LinearProgress, withStyles } from "@material-ui/core";
import { countBy, each } from "lodash";
import React from "react";
import { isDocumentRevisionInDraft, isDocumentRevisionReleased } from "../../../../../../ui/documentRevision/helpers/documentRevisionStatus";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

const DocumentRevisionFormProgressBar = ({
  smartReferencesFrom,
}) => {
  const statuses: string[] = [];
  const Step: string[] = [];
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
      console.log("stepLHRs", lhrStep);
      statuses.push(getLHRStatus(lhrStep));
      const match = lhrStep?.name.split("Step")[1].split("(")[0].trim().replaceAll("#", "");


      Step.push(match);

    });
  };


  prepareProgressBarData(smartReferencesFrom);
  console.log("statuses", statuses);
  console.log("Step", Step);
  const count = countBy(statuses);
  console.log("count", count);

  const Data = [];

  Step.forEach((element, index) => {
    Data[element] = statuses[index];
  });

  console.log("Data", Data);

  Data.forEach((status, index) => status === "inprogress" ? resultInprogress.push(index) : resultCompleted.push(index));

  console.log("resultInprogress", resultInprogress);
  console.log("resultCompleted", resultCompleted);

  return (
    <Box px={4.25}>
      <BorderLinearProgress variant="determinate" value={resultCompleted.length / Data.length} />
      <Box component="div">{resultCompleted.length > 0 && <p>Step {resultCompleted?.map((e) => e)} completed.</p>}
        {resultInprogress && <p>Step {resultInprogress?.map((e) => e + ",")} in progress...</p>}</Box>
    </Box>
  );
};

export default DocumentRevisionFormProgressBar;
