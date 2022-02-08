import React from 'react';
import { Avatar } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

export default function Avatars(props) {
  const classes = useStyles();
  const {src, alt, ...others} = props;

  return (
    <div className={ classes.root }>
      <Avatar alt={ alt } src={ src }
              { ...others }
              className={ classes.large }
      />
    </div>
  );
}
