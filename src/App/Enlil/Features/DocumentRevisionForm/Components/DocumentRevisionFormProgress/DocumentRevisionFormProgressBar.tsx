import { LinearProgress, withStyles } from "@material-ui/core";
import { each } from "lodash";
import React from "react";
import { getLatesReferenceVersion } from "../../../../../../ui/documentRevision/forms/transform";
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
  const getLHRStatus = (stepLHRs) => {
    const status = stepLHRs?.status;
    let lhrstatus = "";
    if (stepLHRs && isDocumentRevisionReleased(status)) {
      lhrstatus = "form.builder.step.complete";
    } else if (stepLHRs && isDocumentRevisionInDraft(status)) {
      lhrstatus = "form.builder.step.inprogress";
    }
    return lhrstatus || status;
  };

  const prepareProgressBarData = (smartRefs) => {
    each(smartReferencesFrom, (reference) => {
      const highestReference = getLatesReferenceVersion(smartReferencesFrom);
      const lhrStep = highestReference?.fromDocRev;
      statuses.push(getLHRStatus(lhrStep));
    });
  };

  prepareProgressBarData(smartReferencesFrom);

  return (
    <BorderLinearProgress variant="determinate" value={50} />
  );
};

export default DocumentRevisionFormProgressBar;
