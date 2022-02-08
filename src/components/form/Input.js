import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import { TextField } from "@mui/material";

class Input extends Component {
	constructor(props) {
		super(props);
		this.wrapper = React.createRef();
	}

	render() {
		const {
			name, label, className, errors, autoComplete, value, onChange,
			mask, maskChar, formatChars, ...props
		} = this.props;

		return (
			mask ? <InputMask
					{ ...props }
					mask={ mask }
					maskChar={ maskChar }
					formatChars={ formatChars }
					value={ value }
					onChange={ onChange }
					error={ !!errors }
					label={ label }
					className={ className }
					variant="outlined"
					helperText={ errors ? errors : undefined }
					name={ name }
					autoComplete={ autoComplete ? autoComplete : "off" }
					ref={ this.wrapper }
				>
					{ (inputProps, ref) => <TextField { ...inputProps } ref={ ref } disableunderline="true"/> }
				</InputMask> :
				<TextField
					{ ...props }
					value={ value }
					onChange={ onChange }
					error={ !!errors }
					label={ label }
					className={ className }
					variant="outlined"
					helperText={ errors ? errors : undefined }
					name={ name }
					autoComplete={ autoComplete ? autoComplete : "off" }
				/>
		);
	}
}

export default Input;
