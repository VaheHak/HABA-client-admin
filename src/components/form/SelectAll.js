import React, { Component } from 'react';
import _ from 'lodash';
import { FormControl, FormHelperText, InputLabel, makeStyles, Select } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));
const classes = useStyles;
export default class SelectAll extends Component {

  render() {
    const {
      label, data, value, defaultValue, vName, keyValue,
      onChange, size, errors, uniq, i, df, ...others
    } = this.props;
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
          defaultValue={ defaultValue }
          onChange={ onChange }
          label={ label }
          inputProps={ {
            name: 'All',
            id: uniqId,
          } }
        >
          <option aria-label="None" value="" style={ {color: 'grey'} }>{ df ? `- ${ df } -` : null }</option>
          { _.map(uniq ? _.uniqBy(data, vName) : data, (value, key) =>
            value[keyValue] ? (<option value={ value[keyValue] } key={ key }>
              { value[vName] ? _.isObject(value[vName]) ?
                value[vName]?.[i] ? value[vName][i] : `${ value[keyValue] }) - No ${ _.capitalize(i) } -` :
                value[vName] : `${ value[keyValue] }) - No ${ _.capitalize(vName) } -` }
            </option>) : null
          ) }
        </Select>
        { errors ? <FormHelperText>{ errors }</FormHelperText> : null }
      </FormControl>
    );
  }
}
