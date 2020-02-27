import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { ReactComponent as CloseIcon } from "../../../../assets/images/close_delete.svg";
import SummaryField from "../../../common/summary/base";
import Text from "../../../components/Text";
import { Translation } from "../../../translations/types";
import styles from "./EditRemoveAddFields.styles";


interface OwnProps {
  canUpdateCompany: boolean;
  saveChanges: () => void;
  label: Translation;
  noValueLabel: Translation;
  addLabel: Translation;
  editLabel: Translation;
  title: Translation;
  placeholder: string;
  addFieldButtonLabel: Translation;
  fields: any[];
}

type Props = OwnProps;

export const EditRemoveAddFields: React.FunctionComponent<Props> = ({
  canUpdateCompany,
  saveChanges,
  label,
  noValueLabel,
  editLabel,
  addLabel,
  title,
  placeholder,
  addFieldButtonLabel,
  fields,
}) => {
  const classes = styles();

  const [shareholders, saveShareHolders] = useState(fields);
  const [isAdding, toggleAdd] = useState(false);

  const handleRemoveShareholder = (idx) => {
    saveShareHolders(shareholders.filter((s, sidx) => idx !== sidx));
  };

  const handleShareholderNameChange = (idx, evt) => {
    const newShareholders = shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) {
        return shareholder;
      }
      return evt.target.value;
    });

    saveShareHolders(newShareholders);
  };

  const handleAddShareholder = () => {
    saveShareHolders(shareholders.concat([""]));
  };
  const handleOpenEdit = () => {
    toggleAdd(true);
    if (isEmpty(shareholders)) {
      saveShareHolders(shareholders.concat([""]));
    }
  };


  return (
    <Box>
      {canUpdateCompany && !isAdding &&
        <Box marginTop={4} >
          <SummaryField
            label={label}
            value={shareholders.map((input) => input).join(", ")}
            noValueOption={<Text translation={noValueLabel} />}
          />
          <Button
            variant="text"
            color="primary"
            onClick={handleOpenEdit}
            id="EditRemoveAddFields-add"
            className={classes.addButton}
          >
            {isEmpty(shareholders) &&
              <Icon style={{ marginRight: "10px" }}>
                <AddCircleOutlineOutlinedIcon />
              </Icon>
            }
            <Text translation={isEmpty(shareholders) ? addLabel : editLabel} />
          </Button>
        </Box>
      }
      {isAdding &&
        <Typography variant="h6" className={classes.title}>
          <Text message={title} />
        </Typography>
      }
      {isAdding && canUpdateCompany && !isEmpty(shareholders) && shareholders.map((shareholder, idx) => (
        <div className={classes.shareholder} key={idx} >
          <input
            type="text"
            placeholder={placeholder}
            value={shareholder}
            onChange={(e) => handleShareholderNameChange(idx, e)}
            className={classes.inputField}
          />
          <button
            type="button"
            id="EditRemoveAddFields-removeField"
            onClick={() => handleRemoveShareholder(idx)}
            className={classes.removeButton}
          >
            <CloseIcon />
          </button>
        </div>
      ))}
      {isAdding && <div>
        <Box>
          <Button
            variant="text"
            color="primary"
            onClick={handleAddShareholder}
            id="EditRemoveAddFields-add"
            className={classes.addButton}
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
              toggleAdd(false);
              saveChanges();
            }}
            id="EditRemoveAddFields-done"
          >
            <Text translation="common.done" />
          </Button>
          <Button
            className={classes.outlinedButton}
            variant="outlined"
            onClick={() => { toggleAdd(false); }}
            id="EditRemoveAddFields-cancel"
          >
            <Text translation="common.cancel" />
          </Button></Box></div>}
    </Box>
  );
};

export default EditRemoveAddFields;
