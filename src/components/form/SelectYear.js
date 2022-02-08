import * as React from 'react';
import { TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import moment from "moment";

export default function SelectYear(props) {
  const {className, label, errors, value, onChange, defaultValue, ...others} = props;

  return (
    <LocalizationProvider dateAdapter={ AdapterMoment }>
      <DatePicker
        { ...others }
        views={ ['year'] }
        label={ label }
        value={ value ? +value : defaultValue ? moment(defaultValue) : moment() }
        minDate={ moment(1970) }
        maxDate={ moment() }
        onChange={ onChange }
        renderInput={ (params) =>
          <TextField className={ className } { ...params } error={ !!errors } helperText={ errors ? errors : null }/> }
      />
    </LocalizationProvider>
  );
}
