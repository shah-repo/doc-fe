import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { AsyncState } from "../../../state/types";
import DatePickerField from "../../components/forms/fields/DatePickerField";
import { FormContext } from "../../components/forms/FormContext";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import { EffectiveDateFormValues } from "../form/types";

interface Props {
  effectiveDatePickerDialog: DialogHandler;
  asyncState: AsyncState;
  onSubmit: (e: EffectiveDateFormValues) => void;
}

/** Dialog used for choosing an effective date if different than Approved date.
 * @param effectiveDatePickerDialog Dialog handler.
 * @param asyncState Async State.
 * @param onSubmit Function executed on effective date Confirm.
 */
export const ChangeRequestEffectiveDatePickerDialog: React.FunctionComponent<Props> = ({
  effectiveDatePickerDialog,
  asyncState,
  onSubmit,
}) => (
  <Dialog open={effectiveDatePickerDialog.isOpen}>
    <DialogTitle>
      <Text translation={"transition.action.close.date"} />
    </DialogTitle>
    <DialogContent>
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik
          initialValues={{}}
          onSubmit={onSubmit}
        >
          <Form>
            <DatePickerField
              name="effectiveDate"
              label="transition.action.effective.date"
              size="sm"
            />
            <SubmitButton
              {...{ asyncState }}
              label="transition.action.confirm"
              id="SetEffectiveDate-submit"
              fullWidth={true}
            />
          </Form>
        </Formik>
      </FormContext.Provider>
    </DialogContent>
  </Dialog>
);

export default ChangeRequestEffectiveDatePickerDialog;
