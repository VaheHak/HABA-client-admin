import * as React from 'react';
import _ from "lodash";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

export default function InputRadio(props) {
  const {label, value, data, disabled} = props;
  return (
    <FormControl component="fieldset" disabled={ disabled }>
      <FormLabel component="legend">{ label }</FormLabel>
      <RadioGroup
        row aria-label="gender" name="row-radio-buttons-group"
        value={ value }
        onChange={ props.onChange }
      >
        { _.isArray(data) ?
          _.map(data, (v, k) => (
            <FormControlLabel
              key={ k }
              value={ v.value }
              control={ <Radio color="default"/> }
              label={ v.name }
              labelPlacement="start"
            />
          ))
          : <><FormControlLabel
            value={ props.firstValue }
            control={ <Radio color="default"/> }
            label={ props.first }
            labelPlacement="start"
          />
            <FormControlLabel
              value={ props.secondValue }
              control={ <Radio color="default"/> }
              label={ props.second }
              labelPlacement="start"
            /></>
        }
      </RadioGroup>
    </FormControl>
  );
}
