// import { Button } from "@material-ui/core";
import { Window, WindowActionsBar } from "@progress/kendo-react-dialogs";
import { Field, FieldWrapper, Form, FormElement } from "@progress/kendo-react-form";
import { TextArea } from "@progress/kendo-react-inputs";
import React from "react";
import GridCellStyles from "./grid.cell.styles";

const textAreaValidator = (value) => !value ? "Address is required" : "";

const FormTextArea = (fieldRenderProps) => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    disabled,
    hint,
    type,
    optional,
    defaultV,
    isEdit,
    ...others
  } = fieldRenderProps;
  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hindId = showHint ? `${id}_hint` : "";
  const errorId = showValidationMessage ? `${id}_error` : "";
  return <FieldWrapper>
    <div className={"k-form-field-wrap"}>
      <TextArea defaultValue={defaultV} valid={valid} type={type} id={id} disabled={disabled} rows={17} ariaDescribedBy={`${hindId} ${errorId}`} {...others} />
      {/* {
        isEdit ? <TextArea defaultValue= {defaultV} value= {defaultV}  valid={valid} type={type} id={id} disabled={disabled} rows={17} ariaDescribedBy={`${hindId} ${errorId}`} {...others} /> :
          <TextArea value= {defaultV} valid={valid} type={type} id={id} disabled={disabled} rows={17} ariaDescribedBy={`${hindId} ${errorId}`} {...others} />
      } */}

    </div>
  </FieldWrapper>;
};

export const SchemaForm = (props) => {
  const classes = GridCellStyles();

  return (
    <Window title={"Schema"} onClose={props.cancelEdit} className="schemaForm"
      initialHeight={505}
      initialWidth={524}
      minimizeButton={() => null}
      maximizeButton={() => null}>
      {/* <div>
        {
          props.isEdit ? <TextArea rows={18}
            defaultValue={props.item ? JSON.stringify(props.item, undefined, 4) : ""}
          /> :
            <TextArea rows={18} value={props.item ? JSON.stringify(props.item, undefined, 4) : ""} />
        }
      </div> */}
      <Form onSubmit={props.addClick} render={(formRenderProps) => <FormElement >
        <fieldset className={"k-form-fieldset"}>
          <Field id={"schema"} name={"schema"} label={"Schema"} component={FormTextArea} validator={textAreaValidator} defaultV={props.item ? JSON.stringify(props.item, undefined, 4) : ""} isEdit={props.isEdit} />
          {/* <div className="k-form-buttons">
            <Button onClick={formRenderProps.onFormReset}>
                  Clear
            </Button>
          </div> */}
          <WindowActionsBar layout={"end"}>
            <button type="button"
              className={`${"k-button"} ${classes.schemaCancelBtn}`}
              onClick={props.cancelEdit}>
              Cancel
            </button>
            {/* <Button type={"submit"} disabled={!formRenderProps.allowSubmit && !props.isEdit}
              className= {`${"k-button"} ${classes.schemaAddBtn}`}
            >
                  Submit
            </Button> */}
            <button
              type="submit"
              className= {`${"k-button"} ${classes.schemaAddBtn}`}
              disabled={!props.isEdit}
            >Add</button>
          </WindowActionsBar>
        </fieldset>
      </FormElement>} />
    </Window>
  );
}
;
