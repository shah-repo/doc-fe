import { AssessmentType } from "../../../state/ducks/changeRequest";
import { assessmentStatementOption } from "./helpers";

export const getCustomContainers = (type: AssessmentType) => {
  const reasoningOptions = assessmentStatementOption(type);
  const toolbarOptions = reasoningOptions.map((option) => option.value);
  return [
    [{ assessment: toolbarOptions }],
  ];
};

export const customHandlers = {
  assessment(value: string) {
    const that: any = this;
    if (value) {
      that.quill.setText(value);
    }
  },
};

export const customToolbarAction = () => {
  const placeholderPickerItems =
    Array.prototype.slice.call(document.querySelectorAll(".ql-assessment .ql-picker-item"));
  placeholderPickerItems.forEach((item) => item.textContent = item.dataset.value);
  const dropdown = document.querySelector(".ql-assessment .ql-picker-label");
  if (!dropdown) {
    return;
  }
  dropdown.innerHTML
      = "Select reasoning" + dropdown.innerHTML;
};
