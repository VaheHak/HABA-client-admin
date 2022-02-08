import React, { Component } from 'react';
import _ from 'lodash';
import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));
const classes = useStyles;
export default class Selects extends Component {

  render() {
    const {label, data, value, vName, keyValue, onChange, size, errors, df, ...others} = this.props;
    const uniqId = _.uniqueId('outlined-age-native-simple');
    return (
      <FormControl variant="outlined" size={ size }
                   className={ `${ classes.formControl }` }
                   style={ {width: '100%'} }
                   error={ !!errors }
      >
        <InputLabel htmlFor={ uniqId }>{ label }</InputLabel>
        <Select
          native
          { ...others }
          value={ value }
          onChange={ onChange }
          label={ label }
          inputProps={ {
            name: 'All',
            id: uniqId,
          } }
        >
          <option aria-label="None" value="" style={ {color: 'grey'} }>{ df ? `- ${ df } -` : null }</option>
          { _.map(_.uniqBy(data, vName), (value, key) =>
            value[vName] ? (<option value={ value[keyValue] } key={ key }>{ value[vName] }</option>) : null
          ) }
        </Select>
        { errors ? <FormHelperText>{ errors }</FormHelperText> : null }
      </FormControl>
    );
  }
}
