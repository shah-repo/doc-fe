import React from "react";
import { useState } from "react";

import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";

//Component Styles using material ui

import useStyles from "./RelatedPart.styles";

// Main Component

export const RelatedPart: React.FunctionComponent = () => {
  const [value, setValue] = useState("");

  const [disable, setDisable] = useState({
    disable1: false,
    disable2: false,
    disable3: false,
  });

  const classes = useStyles();

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setValue(event.target.value);

    // Clicked one radio button get disabled other radio button

    switch (event.target.value) {
      case "no":
        setDisable({ disable1: false, disable2: true, disable3: true });
        break;
      case "together":
        setDisable({ disable1: true, disable2: false, disable3: true });
        break;
      case "seperate":
        setDisable({ disable1: true, disable2: true, disable3: false });
        break;
    }
  };

  console.log("From RadioGroupComponent");
  return (
    <>
      <div>
        <FormControl>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Is this a parent part?
            <Tooltip title="Parent part info" arrow>
              <InfoIcon color="primary" />
            </Tooltip>
          </Typography>

          <RadioGroup row value={value} onChange={changeHandler}>
            <FormControlLabel
              value="no"
              control={<Radio color="primary" disableRipple={true} />}
              label="No"
              disabled={disable.disable1}
            />
            <FormControlLabel
              value="together"
              control={<Radio color="primary" disableRipple={true} />}
              label="Yes, Child Released Together"
              disabled={disable.disable2}
            />
            <FormControlLabel
              value="seperate"
              control={<Radio color="primary" disableRipple={true} />}
              label="Yes, Child Released Seperately"
              disabled={disable.disable3}
            />
          </RadioGroup>
        </FormControl>
      </div>
      {value === "together" && <RelatedPartGrid />}
      {value === "seperate" && <SeperateButton />}
    </>
  );
};

//Seperate Button /////////////////////////////////

const SeperateButton: React.FunctionComponent = () => {
  const classes = useStyles();
  console.log("From SeperateButtonComponent");

  return (
    <Button variant="contained" color="primary" className={classes.btn}>
      + add Related Part
    </Button>
  );
};

// RelatedPart/////////////////////////////

const RelatedPartGrid: React.FunctionComponent = () => {
  const classes = useStyles();

  const [visible, setVisible] = useState([{ show: "" }]);

  const morePartClickHandler = () => {
    setVisible([...visible, { show: "" }]);
  };

  console.log("From RelatedPartGridComponent");

  return (
    <>
      <Grid justifyContent="space-between" container>
        <Grid item>
          <Typography variant="h6" id="tableTitle" component="div">
            Related Parts
          </Typography>
        </Grid>

        <Grid item>
          <Typography>
            <Button
              color="primary"
              startIcon={<AddCircleIcon color="primary" />}
              onClick={morePartClickHandler}
            >
              Add Related part
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <div>
        <div className={classes.mainDiv}>
          <div style={{ paddingLeft: "10%" }}>DOC ID</div>
          <div>TITLE</div>
          <div style={{ paddingRight: "10%" }}>OBSELETE</div>
        </div>
        {visible.map((singleShow, index) => {
          return index > 0 && singleShow && <ShowInputField key={index} />;
        })}
        {
          <Button
            className={classes.fulllengthButton}
            variant="outlined"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            onClick={morePartClickHandler}
          >
            ADD RELATED PART
          </Button>
        }
      </div>
      <Divider />
    </>
  );
};

//Add related part: show inputfield////////////////////////

const ShowInputField: React.FunctionComponent = () => {
  const [field1, setField1] = useState();
  const [inputValue, setInputValue] = useState<any[]>([]);

  const readingValueHnadler = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputValue((prevInputValue) => [...prevInputValue, event.target.name]);
  };
  console.log(inputValue);

  const classes = useStyles();

  console.log("From ShowInputFieldComponent");
  return (
    <div className={classes.mainDiv1}>
      <div className={classes.itemSpace}>
        <label>DOC ID - 123</label>
        <TextField
          variant="outlined"
          onChange={(e: any) => setField1(e.target.value)}
          onBlur={readingValueHnadler}
          name={field1}
        />
      </div>
      <div>
        <label>Title</label>
        <TextField variant="outlined" />
      </div>
      <div>
        <span style={{ paddingRight: "90px" }}>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<ClearIcon />}
          />
        </span>
        <span>
          <Button color="primary" variant="outlined" startIcon={<DoneIcon />} />
        </span>
      </div>
    </div>
  );
};
