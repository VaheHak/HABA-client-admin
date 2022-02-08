import React from 'react';
import { Snackbar } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@mui/material/Alert';
import { withRouter } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={ 6 } ref={ ref } variant="filled" { ...props } />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function ResInfo(props) {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway'){
      return;
    }
    if (props.successFunc){
      props.successFunc();
    }
  };

  const {value, res, msg, msg2} = props;
  console.clear();
  return (
    <div className={ classes.root }>
      <Snackbar open={ !!value } autoHideDuration={ 5000 } onClose={ handleClose }
                anchorOrigin={ {horizontal: 'center', vertical: 'bottom'} }>
        <Alert onClose={ handleClose } severity={ res } sx={ {width: '100%'} }>
          { msg ? msg.replaceAll('_', ' ') : null }
          <br/>
          { msg2 ? <strong>{ msg2 }</strong> : null }
        </Alert>
      </Snackbar>
    </div>
  );
}

export default withRouter(ResInfo);
// error,warning,info,success
