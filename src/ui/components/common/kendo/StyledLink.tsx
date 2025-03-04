import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  link: {
    color: `${theme.palette.primary.main} !important`,
    cursor: 'pointer',
    textDecoration: 'initial !important',
    '&:hover': {
      textDecoration: 'underline !important',
    },
  },
}));

const StyledLink = ({ to, onClick, children, ...props }) => {
  const classes = useStyles();
  const handleClick = (onClick?: (e: React.MouseEvent) => void) => {
    return (e: React.MouseEvent) => {
      if (onClick) onClick(e);
    };
  };

  return (
    <RouterLink
      to={to}
      onClick={handleClick(onClick)}
      className={classes.link}
      target="_blank"
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default StyledLink;
