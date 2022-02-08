import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${ value } $`;
}

export default function RangeSlider(props) {
  const {value, onChange, onChangeCommitted, label} = props;

  return (
    <Box sx={ {width: '100%'} }>
      <Slider
        getAriaLabel={ () => label }
        value={ value }
        step={ 10 }
        min={ 0 }
        max={ 20000 }
        onChange={ onChange }
        onChangeCommitted={ onChangeCommitted }
        valueLabelDisplay="auto"
        getAriaValueText={ valuetext }
        valueLabelFormat={ valuetext }
      />
    </Box>
  );
}
