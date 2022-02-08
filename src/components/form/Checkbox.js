import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

export default function InputCheckbox(props) {
  const {error, label, label1, label2, onChange, path} = props;

  const [state, setState] = React.useState({
    first: true,
    second: true,
  });
  const {first, second} = state;

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
    if (event.target.name === 'first'){
      event.target.checked ? onChange(path, [second ? 0 : 2, 1]) : onChange(path, [second ? 0 : 2, 2])
    } else{
      event.target.checked ? onChange(path, [0, first ? 1 : 2]) : onChange(path, [2, first ? 1 : 2])
    }
  };

  return (
    <FormControl
      error={ !!error }
      component="fieldset"
      sx={ {m: 1} }
      variant="standard"
    >
      <FormLabel component="legend">{ label }</FormLabel>
      <FormGroup sx={ {display: 'flex', flexDirection: 'row'} }>
        <FormControlLabel
          control={
            <Checkbox
              checked={ first }
              onChange={ handleChange }
              name="first"/>
          }
          label={ label1 }
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={ second }
              onChange={ handleChange }
              name="second"/>
          }
          label={ label2 }
          labelPlacement="start"
        />
      </FormGroup>
      <FormHelperText>{ error ? error : null }</FormHelperText>
    </FormControl>
  );
}
