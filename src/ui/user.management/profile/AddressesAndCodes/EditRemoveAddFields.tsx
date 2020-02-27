import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
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
  addFieldButtonLabel: Translation;
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
  addFieldButtonLabel,
  fields,
  saveChanges,
  numberValues,
}) => {
  const classes = styles();

  const [values, saveValues] = useState(fields);
  const [isAdding, toggleAdd] = useState(false);
  const [showError, toogleError] = useState(false);


  const handleRemove = (idx) => {
    saveValues(values.filter((s, sidx) => idx !== sidx));
  };

  const handleNameChange = (idx, evt) => {
    const newValues = values.map((value, sidx) => {
      if (idx !== sidx) {
        return value;
      }
      const regex = /^[0-9]*$/;
      if (regex.test(evt.target.value)) {
        toogleError(false);
        return evt.target.value;
      } if (!regex.test(evt.target.value)) {
        toogleError(true);
      }
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
    saveValues(fields);
  };

  const renderInputFields = () => {
    if (isAdding && !isEmpty(values)) {
      return values.map((value, idx) => (
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
            id="EditRemoveAddFields-removeField"
            onClick={() => handleRemove(idx)}
            className={classes.removeButton}
          >
            <CloseIcon />
          </button>
        </div>
      ));
    }
  };

  const renderEditButton = () => {
    if (isAdding) {
      return (
        <div>
          {numberValues && showError &&
            <Typography variant="subtitle2" style={{ color: "red" }}>
              <Text message="Must be a number" />
            </Typography>}
          <Box>
            <Button
              variant="text"
              color="primary"
              onClick={handleAdd}
              id="EditRemoveAddFields-add"
              className={classes.addButton}
              style={{ marginLeft: 0 }}
            >
              <Icon style={{ marginRight: "10px" }}>
                <AddCircleOutlineOutlinedIcon />
              </Icon>
              <Text translation={addFieldButtonLabel} />
            </Button>
          </Box>
          <Box width="507px" display="flex" justifyContent="flex-end">
            <Button
              className={classes.containedButton}
              variant="contained"
              color="primary"
              onClick={() => {
                if (numberValues && showError) {
                  return;
                }
                toggleAdd(false);
                saveChanges(values);
              }}
              id="EditRemoveAddFields-done"
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
        </div>
      );
    }
  };


  return (
    <Box>
      <Box display="inline-flex" >
        <Typography variant="h6" className={classes.title}>
          <Text message={title} />
        </Typography>
        {canUpdateCompany && !isAdding &&
          <Button
            variant="text"
            color="primary"
            onClick={handleOpenEdit}
            id="EditRemoveAddFields-add"
            className={classes.addButton}
          >
            {isEmpty(values) &&
              <Icon style={{ marginRight: "10px" }}>
                <AddCircleOutlineOutlinedIcon />
              </Icon>
            }
            <Text translation={isEmpty(values) ? addLabel : editLabel} />
          </Button>
        }
      </Box>
      {!isAdding && fields.map((input, index) => (
        <Typography variant="subtitle1" className={classes.title} key={index}>
          <Text message={input} />
        </Typography>
      ))}
      {isEmpty(fields) &&
        <Typography variant="subtitle1" className={classes.title}>
          <Text translation={noValueLabel} />
        </Typography>
      }
      {renderInputFields()}
      {renderEditButton()}
    </Box>
  );
};

export default EditRemoveAddFields;
