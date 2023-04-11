import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useState } from "react";

interface Option {
  label: string;
}

interface SearchBarProps {
  options: Option[];
  onSearch: (value: string) => void;
}

const useStyles = makeStyles((theme) => ({
  searchBar: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    width: "393px",
    height: "34px",
    left: "250px",
    top: "7px",
    background: "#FFFFFF",
    border: " 1px solid #9A9FAB",
    borderRadius: "4px",
    cursor: "pointer",
  },

  inputRoot: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      border: "none",
      background: "transparent",
      padding: 0,
    },
    "& .MuiAutocomplete-input": {
      cursor: "pointer",
      transition: "height 0.3s, width 0.3s",
    },
    "width": "350px",
    "height": "34px",
  },
  inputRootExpanded: {
    height: "184pxpx", // Set height to the expanded value
    width: "867px", // Set width to the expanded value
  },
  root: {
    "& .MuiAutocomplete-popupIndicator": {
      display: "none", // Hide the expand/collapse arrow icon
    },
  },

}));

const Search: React.FC<SearchBarProps> = ({ options, onSearch }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleSearch = (event: React.ChangeEvent<{}>, value: Option | null) => {
    if (value) {
      setSearchText(value.label);
      if (onSearch) {
        onSearch(value.label);
      }
    } else {
      setSearchText("");
    }
  };

  const onClick = () => {
    setIsClicked(true);
  };

  return (
    <div className={classes.searchBar}>
      <Autocomplete
        freeSolo
        options={options}
        className={`${classes.root} ${isClicked ? classes.inputRootExpanded : ""}`}
        disableClearable
        getOptionLabel={(option) => option.label}
        onClick={onClick}

        renderInput={(params) => (
          <div style={{ display: "flex" }}>
            <div className="search-icon-container" style={{ display: "flex", flex: "0 0 10%", color: "#767B87", justifyContent: "center", alignItems: "center" }}>
              <FontAwesomeIcon icon={solid("magnifying-glass")} />
            </div>
            <div style={{ flex: "0 0 90%", padding: 0 }}>
              <TextField
                {...params}
                variant="outlined"
                value={searchText}
                placeholder={isClicked ? "Type here to search" : "Search"}
                fullWidth
                className={`${classes.inputRoot} ${isClicked ? classes.inputRootExpanded : ""}`}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
          </div>
        )}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;

