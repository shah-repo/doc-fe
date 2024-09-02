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
  return (
    <RouterLink
      to={to}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(e); } : undefined}
      className={classes.link}
      target="_blank"
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default StyledLink;
