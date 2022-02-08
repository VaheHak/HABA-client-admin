import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

export default function TypeCheckbox(props) {
  const {error, label, label1, label2, onChange, path, value} = props;
  const [state, setState] = React.useState(value ? {
    first: !!value.includes(1),
    second: !!value.includes(2),
  } : {
    first: false,
    second: false,
  });
  const {first, second} = state;

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
    if (event.target.name === 'first'){
      event.target.checked ? onChange(path, second ? [1, 2] : [1]) : onChange(path, second ? [2] : [])
    } else{
      event.target.checked ? onChange(path, first ? [1, 2] : [2]) : onChange(path, first ? [1] : [])
    }
  };

  return (
    <FormControl
      error={ !!error }
      component="fieldset"
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
