import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, makeStyles, Popper } from "@material-ui/core";
import cx from "classnames";
import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { Autocomplete } from "../../../../ui/components/forms/fields-next";
import { Colors, withThemeNext } from "../../../../ui/layout/theme-next";


// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  { title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  { title: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb", year: 1964 },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  { title: "Star Wars: Episode VI - Return of the Jedi", year: 1983 },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  { title: "Eternal Sunshine of the Spotless Mind", year: 2004 },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
    height: 42,
  },
  focused: {
    width: "100%",
  },
  popper: {
    width: "100%",
  },
  paper: {
    ...omit(theme.overrides?.MuiMenu?.paper, "marginTop", "paddingTop"),
    boxShadow: theme.shadows[2],
    marginTop: -40,
    paddingTop: 40,
  },
  input: {
    borderBottom: "none",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 46,
  },
  list: {
    borderTop: `1px solid ${Colors.stroke}`,
  },
}));


const Search: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [popperClass, setPopperClass] = useState<string>();

  useEffect(() => {
    setPopperClass(isFocused ? classes.popper : undefined);
  }, [isFocused, classes.popper]);

  const doSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const resetField = () => {
    setSearchTerm("");
    setIsFocused(false);
  };

  const gotoSearchPage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      window.location.href = `https://www.google.com/search?q=${searchTerm}`;
      resetField();
    }
  };

  const getOptions = (searchString: string) => {
    if (!searchString) {
      return top100Films.slice(0, 3).map((el) => ({
        ...el,
        group: intl.formatMessage({ id: "recent.search" }),
      }));
    }
    return top100Films.map((el) => ({
      ...el,
    }));
  };

  const handleFocusChange = (nextState: boolean) => () => setIsFocused(nextState);
  const placeholder = intl.formatMessage({ id: isFocused ? "keyword.to.search" : "common.search" });

  const options = getOptions(searchTerm);

  return (
    <Autocomplete
      blurOnSelect
      placeholder={placeholder}
      className={cx(classes.root, { [classes.focused]: isFocused })}
      onFocus={handleFocusChange(true)}
      onBlur={handleFocusChange(false)}
      options={options}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.title}
      PopperComponent={(props) => <Popper {...props} className={popperClass} />}
      inputProps={{
        endAdornment: null,
        value: searchTerm,
        className: cx({ [classes.input]: isFocused }),
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={regular("search")} />
          </InputAdornment>
        ),
        onChange: doSearch,
        onKeyDown: gotoSearchPage,
      }}
      noOptionsText="nothing.found"
      classes={{
        paper: classes.paper,
      }}
      onChange={
        () => {
          history.push(
            "/document_revision/4d90114d-bae9-4c36-b35b-1e4712f876af/version/bb6dacf0-d6b2-48c5-a3f0-d8967d2e5ce2"
          );
          resetField();
        }
      }
    />
  );
};

export default withThemeNext(Search);
