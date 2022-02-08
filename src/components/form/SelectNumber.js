import React, { Component } from 'react';
import _ from 'lodash';
import { FormControl, InputBase, InputLabel, MenuItem, Select } from "@mui/material";
import { styled } from '@mui/material/styles';

const BootstrapInput = styled(InputBase)(({theme}) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

class SelectNumber extends Component {

  render() {
    const {data, label, value, onChange, style, plus, ...others} = this.props;

    return (
      <div style={ style }>
        <InputLabel id="demo-customized-select-label">
          { label }</InputLabel>
        <FormControl style={ {width: '100%'} }>
          <Select
            { ...others }
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={ value ? value : '' }
            onChange={ onChange }
            input={ <BootstrapInput/> }
          >
            <MenuItem value="">
              <em>Choose</em>
            </MenuItem>
            { _.map(_.sortBy(data), (value, key) =>
              value ? (
                <MenuItem key={ key } value={ value }>
                  { value }
                </MenuItem>
              ) : null) }
            { plus ? <MenuItem value={ data?.length + '+' }>
              { data?.length }+
            </MenuItem> : null }
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default SelectNumber;
