import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { ReactComponent as CloseIcon } from "../../../../assets/images/close_delete.svg";
import Text from "../../../components/Text";
import { Translation } from "../../../translations/types";
import styles from "./EditRemoveAddFields.styles";


interface OwnProps {
  canUpdateCompany: boolean;
  noValueLabel: Translation;
  addLabel: Translation;
  editLabel: Translation;
  title: Translation;
  placeholder: string;
  fields: any[];
  saveChanges: (fields) => void;
  numberValues?: boolean;
}

type Props = OwnProps;

export const EditRemoveAddFields: React.FunctionComponent<Props> = ({
  canUpdateCompany,
  noValueLabel,
  editLabel,
  addLabel,
  title,
  placeholder,
  fields,
  saveChanges,
  numberValues,
}) => {
  const classes = styles();

  const [values, saveValues] = useState(fields);
  const [isAdding, toggleAdd] = useState(false);
  const [showError, toggleError] = useState(false);


  const handleRemove = (idx) => {
    saveValues(values.filter((s, sidx) => idx !== sidx));
  };

  const handleNameChange = (idx, evt) => {
    const newValues = values.map((value, sidx) => {
      if (idx !== sidx) {
        return value;
      }
      const regex = /^[0-9]*$/;
      toggleError(!regex.test(evt.target.value));
      return evt.target.value;
    });
    saveValues(newValues);
  };

  const handleAdd = () => {
    saveValues(values.concat([""]));
  };

  const handleOpenEdit = () => {
    toggleAdd(true);
    if (isEmpty(values)) {
      saveValues(values.concat([""]));
    }
  };

  const onCancel = () => {
    toggleAdd(false);
    toggleError(false);
    saveValues(fields);
  };

  const renderInputFields = () => {
    if (isAdding) {
      return (
        <Form>
          {values.map((value, idx) => (
            <div className={classes.values} key={idx} >
              <input
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleNameChange(idx, e)}
                className={classes.inputField}
                type="text"
                required={true}
              />
              <button
                type="button"
                id={`EditRemoveAddFields-removeField-${idx}`}
                onClick={() => handleRemove(idx)}
                className={classes.removeButton}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
          <Box width="507px" display="flex" justifyContent="flex-end">
            <Button
              className={classes.containedButton}
              variant="contained"
              color="primary"
              type="submit"
              id="EditRemoveAddFields-done"
              disabled={showError && numberValues}
            >
              <Text translation="common.done" />
            </Button>
            <Button
              className={classes.outlinedButton}
              variant="outlined"
              onClick={() => onCancel()}
              id="EditRemoveAddFields-cancel"
            >
              <Text translation="common.cancel" />
            </Button>
          </Box>
        </Form>
      );
    }
  };

  const handleSubmit = () => {
    toggleAdd(false);
    saveChanges(values);
  };

  const renderForm = () => (
    <Formik
      initialValues={fields}
      onSubmit={handleSubmit}
    >
      {renderInputFields}
    </Formik>
  );

  return (
    <Box>
      <Box display="inline-flex" >
        <Typography variant="h6" className={classes.title}>
          <Text message={title} />
        </Typography>
        {canUpdateCompany &&
          <Button
            variant="text"
            color="primary"
            onClick={!isAdding ? handleOpenEdit : handleAdd}
            id="EditRemoveAddFields-add"
            className={classes.addButton}
          >
            {(isAdding || isEmpty(values)) &&
              <Icon style={{ marginRight: "10px" }}>
                <AddCircleOutlineOutlinedIcon />
              </Icon>
            }
            <Text translation={(isAdding || isEmpty(values)) ? addLabel : editLabel} />
          </Button>
        }
      </Box>
      {!isAdding && fields.map((input, index) => (
        <Typography variant="subtitle1" className={classes.title} key={index}>
          <Text message={input} />
        </Typography>
      ))}
      {isEmpty(fields) && !isAdding &&
        <Typography variant="subtitle1" className={classes.title}>
          <Text translation={noValueLabel} />
        </Typography>
      }
      {numberValues && showError &&
        <Typography variant="subtitle2" style={{ color: "red" }}>
          <Text translation="validator.must.be.number" />
        </Typography>
      }
      {renderForm()}
    </Box>
  );
};

export default EditRemoveAddFields;
