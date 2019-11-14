// import { Box } from "@material-ui/core";
import React from "react";
// import Select from "react-select";
import { withAutocompleteDefaults } from "../../hocs/withAutocompleteDefaults";
import { FBAutocompleteProps } from "../../types/autocomplete";
import { observer } from "mobx-react";
import autocompleteList from "../../stores/collections/FBAutocompleteCollection";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;

  return React.cloneElement(data[index], {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
      ...style,
    },
  });
}

const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
    const itemCount = Array.isArray(children) ? children.length : 0;
    const itemSize = smUp ? 36 : 48;

    const outerElementType = React.useMemo(() => {
      return React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
        (props2, ref2) => <div ref={ref2} {...props2} {...other} />,
      );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div ref={ref}>
        <FixedSizeList
          style={{ padding: 0, height: Math.min(6, itemCount) * itemSize, maxHeight: 'auto' }}
          itemData={children}
          height={250}
          width="100%"
          outerElementType={outerElementType}
          innerElementType="ul"
          itemSize={itemSize}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </FixedSizeList>
      </div>
    );
  },
);

// function random(length: number) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';

//   for (let i = 0; i < length; i += 1) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }

//   return result;
// }

const useStyles = makeStyles({
  listbox: {
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  labelRenderer,
  disabled,
  readOnly,
  ...props
}) => {
  // *NOTE: For demo only. Will be removed
  // const [options] = useState<SelectOption[]>([]);
  autocompleteList.fetch();
  const op = autocompleteList.values();
  // return (
  //   <Box mb={4}>
  //     {labelRenderer}
  //     <Select
  //       inputId={`react-select-${props.name}`}
  //       TextFieldProps={{
  //         InputLabelProps: {
  //           htmlFor: `react-select-${props.name}`,
  //           shrink: true,
  //         },
  //       }}
  //       isDisabled={disabled || readOnly}
  //       {...props}
  //       options={[{value: 1, text: "Prvi"}, {value: 2, text: "Drugi"}]}
  //     />
  //   </Box>
  // );

  const classes = useStyles();

  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      disableListWrap
      classes={classes}
      ListboxComponent={ListboxComponent}
      // options={Array.from(new Array(10000)).map(() => random(Math.ceil(Math.random() * 18)))}
      options={op}
      renderInput={(params: any) => (
        <TextField {...params} variant="outlined" placeholder="10,000 options" fullWidth />
      )}
    />
  );

  
};

export default withAutocompleteDefaults(observer(FBAutocomplete));
