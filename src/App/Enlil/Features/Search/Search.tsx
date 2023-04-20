import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, Popper } from "@material-ui/core";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { Autocomplete } from "../../../../ui/components/forms/fields-next";
import { withThemeNext } from "../../../../ui/layout/theme-next";
import useStyles from "./Search.styles";

interface SearchData {
  docId: string;
  name: string;
}

// DUMMY DATA
const searchData: SearchData[] = [
  {
    docId: "FM-03844",
    name: "artem form 2",
  },
  {
    docId: "FM-03843",
    name: "artem form 1",
  },
  {
    docId: "FM-03821",
    name: "RHTML",
  },
  {
    docId: "POAM-01245",
    name: "Purchase Order Approval Matrix (POAM)",
  },
  {
    docId: "FM-03837",
    name: "artem test 2",
  },
  {
    docId: "FM-03835",
    name: "Artem test 1",
  },
];

const Search: React.FC = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const classes = useStyles();
  const [searchTerm, setSeachTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [popperClass, setPopperClass] = useState<string>();

  useEffect(() => {
    setPopperClass(isFocused ? classes.popper : undefined);
  }, [isFocused, classes.popper]);

  const handleSearch = () => {
    // TODO change to actual search-page url
    history.push(`/document_revision/?${searchTerm}`);
    setSeachTerm("");
  };

  const getOptions = (searchString: string) => {
    if (searchString === "") {
      return searchData.slice(0, 3).map((el) => ({
        ...el,
        group: intl.formatMessage({ id: "search.recent" }),
      }));
    }
    return searchData.map((el) => ({
      ...el,
      group: intl.formatMessage({ id: "search.found.count" }, { count: searchData.length }),
    }));
  };

  const handleFocusChange = (nextState: boolean) => () => setIsFocused(nextState);
  const placeholder = intl.formatMessage({ id: isFocused ? "keyword.to.search" : "common.search" });
  const formatOptionLabel = (option: SearchData | string) => {
    if (typeof option === "string") {
      return option;
    }
    return `${option.docId} - ${option.name}`;
  };

  const options = getOptions(searchTerm);

  return (
    <Autocomplete
      blurOnSelect
      disablePortal
      autoComplete
      freeSolo
      filterOptions={(option) => option}
      placeholder={placeholder}
      className={cx(classes.root, { [classes.focused]: isFocused })}
      onFocus={handleFocusChange(true)}
      onBlur={handleFocusChange(false)}
      options={options}
      noOptionsText={intl.formatMessage({ id: "nothing.found" })}
      groupBy={(option) => option.group}
      getOptionLabel={formatOptionLabel}
      PopperComponent={(props) => <Popper {...props} className={popperClass} />}
      onInputChange={(event, value) => { setSeachTerm(value); }}
      inputProps={{
        endAdornment: null,
        className: cx({ [classes.inputFocused]: isFocused }),
        startAdornment: (
          <InputAdornment position="start" className={ cx({ [classes.icon]: isFocused }) }>
            <FontAwesomeIcon icon={regular("search")} />
          </InputAdornment>
        ),
      }}
      inputValue={searchTerm}
      classes={{
        paper: classes.paper,
        option: classes.option,
        groupLabel: classes.groupLabel,
      }}
      onChange={handleSearch}
    />
  );
};

export default withThemeNext(Search);
