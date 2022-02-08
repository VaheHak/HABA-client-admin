import React, { Component } from "react";
import Phone from "react-phone-input-2";
import 'react-phone-input-2/lib/material.css';

export default class PhoneInput extends Component {

  render() {
    const {value, onChange, errors, defaultValue, ...props} = this.props;
    return (<>
      <Phone
        { ...props }
        name="phoneNumber"
        type="text"
        enableSearch
        specialLabel='Phone'
        country={ "am" }
        enableAreaCodes={ true }
        inputProps={ {
          name: "phone",
          country: "am",
          required: true,
          autoFocus: false,
        } }
        value={ value ? value : defaultValue || '' }
        onChange={ onChange }
        onFocus={ (e) => e.preventDefault() }
        inputStyle={ {
          width: "100%",
          height: "40px",
          zIndex: 1,
          borderColor: errors ? '#f44336' : ''
        } }
      />
      <p className='err' style={ {marginTop: '5px'} }>{ typeof errors === "string" ? errors :
        errors?.phoneNumber ? errors.phoneNumber : null }</p>
    </>);
  }
}
