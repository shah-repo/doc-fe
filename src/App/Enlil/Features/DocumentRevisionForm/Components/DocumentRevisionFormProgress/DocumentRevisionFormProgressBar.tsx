import { Box } from "@material-ui/core";
import { each, isEmpty, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Nullable } from "../../../../../../state/ducks/common/types";
import {
  DocumentRevision,
  SmartReference,
} from "../../../../../../state/ducks/documentRevisions/types";
import {
  isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionReleased,
} from "../../../../../../ui/documentRevision/helpers/documentRevisionStatus";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import SM from "../../../../../Shifamed/Utils/SM/SM";
import { BorderLinearProgress } from "./BorderLinearProgress";

interface Props {
  smartReferencesFrom?: SmartReference[];
}

const DocumentRevisionFormProgressBar: React.FunctionComponent<Props> = ({
  smartReferencesFrom,
}) => {
  const intl = useIntl();
  const { _documentRevisionFormState } = SM.useStores();
  const [inprogress, setInprogress] = useState<number[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const getLHRStatus = (stepLHRs?: Nullable<DocumentRevision>) => {
    const status = stepLHRs?.status;
    let lhrstatus = "";
    if (stepLHRs && isDocumentRevisionReleased(status)) {
      lhrstatus = "complete";
    } else if (stepLHRs && (isDocumentRevisionInDraft(status) || isDocumentRevisionInReview(status))) {
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
    const flag = !isEmpty(inProgress) || !isEmpty(complete);
    const oldvalue = _documentRevisionFormState?.isLHRProgressBarVisible;
    if (flag !== oldvalue) {
      _documentRevisionFormState?.setIsLHRProgressBarVisible(flag);
    }
  };

  useEffect(() => {
    prepareProgressBarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartReferencesFrom]);
  const progressValue = completed.length / (completed.length + inprogress.length);

  return (
    <Box px={4.25} mt={1.875}>
      {(!isEmpty(completed) || !isEmpty(inprogress)) && (
        <BorderLinearProgress
          data-cy="LHR-Step-Progress-Bar"
          variant="determinate"
          value={progressValue * 100}
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
            <Box component="span" fontWeight={600} data-cy="completed-steps">
              Step {uniq(completed)?.sort().map((e) => e + ",")}
            </Box>
            <Box component="span" fontWeight={400}>
              &nbsp;completed.&nbsp;
            </Box>
          </>
        )}
        {!isEmpty(inprogress) && (
          <>
            <Box component="span" fontWeight={600} data-cy="inprogress-steps">
              Step {uniq(inprogress)?.sort().map((e) => e + ",")}
            </Box>
            <Box component="span" fontWeight={400}>
              &nbsp;{intl.formatMessage({ id: `form.builder.step.inprogress` }).toLowerCase()}...
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DocumentRevisionFormProgressBar;
