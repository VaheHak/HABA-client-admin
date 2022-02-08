import React, { Component } from 'react';
import clsx from 'clsx';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  width: {
    width: '100%',
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
}));
const classes = useStyles;

class InputPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    }
  }

  handleClickShowPassword = () => {
    const {showPassword} = this.state;
    this.setState({showPassword: !showPassword});
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  render() {
    const {className, errors, value, onChange, label, ...props} = this.props;
    const {showPassword} = this.state;
    return (
      <div className={ classes.root } style={ {width: '100%'} }>
        <div style={ {width: '100%'} }>
          <FormControl className={ clsx(classes.margin, classes.textField) }
                       style={ {width: '100%'} }
                       error={ !!errors }
                       variant="outlined">
            { label ?
              <InputLabel htmlFor="outlined-adornment-password" className="input__label">{ label }</InputLabel>
              : null }
            <OutlinedInput
              { ...props }
              type={ showPassword ? 'text' : 'password' }
              value={ value }
              size={ "small" }
              placeholder={ '********' }
              className={ className }
              onChange={ onChange }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={ this.handleClickShowPassword }
                    onMouseDown={ this.handleMouseDownPassword }
                    edge="end"
                  >
                    { showPassword ? <Visibility/> : <VisibilityOff/> }
                  </IconButton>
                </InputAdornment>
              }
              label={ label ? label : undefined }
            />
            { errors ? <FormHelperText id="component-error-text">{ errors }</FormHelperText> : undefined }
          </FormControl>
        </div>
      </div>
    );
  }
}

export default InputPassword;
