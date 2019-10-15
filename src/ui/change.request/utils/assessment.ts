import { AssessmentType } from "../../../state/ducks/changeRequest";
import { assessmentStatementOption } from "./helpers";

export const getCustomContainers = (type: AssessmentType) => {
  const reasoningOptions = assessmentStatementOption(type);
  const toolbarOptions = reasoningOptions.map((option) => option.value);

  return [
    [{ [`assessment-${type}`]: toolbarOptions }],
  ];
};

export const customHandlers = (type: AssessmentType) => ({
  [`assessment-${type}`](value: string) {
    const that: any = this;

    if (value) {
      that.quill.setText(value);
    }
  },
});

export const customToolbarAction = (type: AssessmentType) => () => {
  const placeholderPickerItems =
    Array.prototype.slice.call(document.querySelectorAll(`.ql-assessment-${type} .ql-picker-item`));
  placeholderPickerItems.forEach((item) => item.textContent = item.dataset.value);

  const dropdown = document.querySelector(`.ql-assessment-${type} .ql-picker-label`);
  if (!dropdown) {
    return;
  }

  dropdown.innerHTML
      = "Select reasoning" + dropdown.innerHTML;
};
