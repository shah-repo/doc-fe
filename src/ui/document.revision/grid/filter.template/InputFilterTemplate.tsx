import { Box, ClickAwayListener, FormControl, makeStyles, MenuItem, Select } from "@material-ui/core";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import {
  Input, InputChangeEvent,
} from "@progress/kendo-react-inputs";
import { isEmpty, map } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";

interface Props extends GridFilterCellProps {
  defaultItem: string;
  onStateChange?: (setDefault: boolean) => void;
}

const useStyles = makeStyles({
  root: {
    "& .MuiInput-input": {
      visibility: "hidden",
      position: "absolute",
      left: "-30px",
    },
  },
});

const filterList = ["contains", "doesnotcontain",  "isequalto", "isnotequalto",
  "startswith", "endswith", "isnull", "isnotnull", "isempty", "isnotempty" ];

export const InputFilterTemplate = ({
  defaultItem,
  onChange,
  value: selectedVal,
}: Props) => {
  const classes = useStyles();
  let sEvent: React.SyntheticEvent<any, Event>;
  const [inputValue, setInputValue] = useState(defaultItem || "");
  const [filterValue, setFilterValue] = useState("contains");
  const [isOpened, setIsOpened] = useState(false);

  const intl = useIntl();
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue !== defaultItem) {
        onChange({ value: inputValue, operator: filterValue, syntheticEvent: sEvent });
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [inputValue]);

  const onChangeEvent = ({ target, syntheticEvent }: InputChangeEvent) => {
    setInputValue(String(target.value || ""));
    sEvent = syntheticEvent;
    sEvent.persist();
  };

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setInputValue("");
    onChange({
      value: "",
      operator: "",
      syntheticEvent: event,
    });
  };

  const onDropdownChange = (syntheticEvent: React.ChangeEvent<{ value: unknown }>) => {
    const { target } = syntheticEvent;
    setFilterValue(String(target.value));
    setIsOpened(false);

    if (isEmpty(inputValue)) {
      return;
    }

    onChange({
      value: inputValue,
      operator: String(target.value),
      syntheticEvent,
    });
  };

  return (
    <div className="k-filtercell">
      <Input
        value={inputValue}
        onChange={onChangeEvent}
        style={{ width: "100%", marginRight: "5px" }}/>
      <ClickAwayListener onClickAway={() => setIsOpened(false)}>
        <Box>
          <FormControl style={{ display: "flex", flexDirection: "row" }}>
            <button
              className="k-button k-button-icon k-clear-button-visible"
              onClick={() => setIsOpened(true)}
            >
              <span className="k-icon k-i-filter" />
            </button>
            <Select className={classes.root}
              IconComponent={() => <span />}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              style={{ width: "0px" }}
              open={isOpened}
              onChange={(e) => onDropdownChange(e)}
            >
              {map(filterList, (item) =>
                <MenuItem value={item}>
                  {intl.formatMessage({ id: `dropdown.filter.${item}` })}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </ClickAwayListener>
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        onClick={onClearButtonClick}
        hidden={(inputValue === "")}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
