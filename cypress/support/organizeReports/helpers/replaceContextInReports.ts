const REGEX_TO_FIND_REQS = /([R])([E])([Q])([-])([0-9]+)/g;
import requirementsJson from "./../../../cache/generated.json";

const REQUIREMENT_HEADER_TEXT = "Requirement";
const requirementIds = Object.keys(requirementsJson);

const formatValue = (req) =>
  `${req} (${requirementsJson[req].field1}): ${requirementsJson[req][REQUIREMENT_HEADER_TEXT]}`;


export function replaceContextInReports(report: any) {
  (report.results || []).forEach((result) => {
    (result.suites || []).forEach((suite) => {
      (suite.suites || []).forEach((suiteWithTests) => {
        (suiteWithTests.tests || []).forEach((test) => {
          if (test.context) {
            const contextObject: { title: string; value: string } = JSON.parse(test.context);
            const satisfiedReqs = test.context.match(REGEX_TO_FIND_REQS);
            if (!satisfiedReqs || !satisfiedReqs.length) {
              return;
            }
            const filteredRequirements = (satisfiedReqs || []).map((r) => {
              if (!requirementIds.includes(r)) {
                // eslint-disable-next-line no-console
                console.log({ "Not found requirement in spec": r });
              } else {
                return r;
              }
            }).filter((x) => x);

            if (!filteredRequirements.length) {
              test.context = null;
            } else {
              contextObject.value = filteredRequirements.map(formatValue).join("\n");
              test.context = JSON.stringify(contextObject);
            }
          }
        });
      });
    });
  });

  return report;
}
