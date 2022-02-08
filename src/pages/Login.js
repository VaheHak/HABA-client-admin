import React, { Component } from 'react';
import _ from "lodash";
import Input from "../components/form/Input";
import { InputAdornment } from "@mui/material";
import { KeyboardBackspace, Sms } from "@material-ui/icons";
import { backToLogin, loginCheck, postLoginRequest } from "../store/actions/admin/users";
import { connect } from "react-redux";
import "../assets/css/pages/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import WrapperLogout from "../components/WrapperLogout";
import ErrorEnum from "../helpers/ErrorHandler";
import PhoneInput from "../components/form/PhoneInput";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      checkData: {},
    }
  }

  handleChange = (path, ev) => {
    const {formData} = this.state;
    _.set(formData, path, ev);
    this.setState({
      formData,
    })
  }

  handleCheck = (path, ev) => {
    const {checkData, formData} = this.state;
    _.set(checkData, path, ev);
    _.set(checkData, 'phoneNumber', formData.phoneNumber);
    this.setState({
      checkData,
    })
  }

  handleSubmit = () => {
    const {formData} = this.state;
    this.props.postLoginRequest(formData);
  }

  handleCheckSubmit = () => {
    const {checkData} = this.state;
    this.props.loginCheck(checkData);
  }

  backTo = () => {
    this.setState({formData: {}});
    this.props.backToLogin();
  }

  render() {
    const {formData, checkData} = this.state;
    const {errors, loginData, checkStatus, checkErrors} = this.props;
    return (
      <WrapperLogout>
        <div className="login__container" style={ {background: `url('/images/bg/loginBg.png')`} }>
          <div className="container">
            <div className="login__content">
              <img className="login__logo" src="/images/logos/haba.png" alt="haba"/>
              { loginData.status === true ?
                <div className="login__form">
                  <h3>Enter Digit Code</h3>
                  <div className="back__to_login" title="Back" onClick={ () => this.backTo() }>
                    <KeyboardBackspace/>
                  </div>
                  <p style={ {color: "red"} }>{ checkErrors.phoneNumber ? ErrorEnum[checkErrors.phoneNumber]
                      ? ErrorEnum[checkErrors.phoneNumber] : checkErrors.phoneNumber
                    : null }</p>
                  <p
                    style={ {color: "red"} }>{ checkStatus?.status === false ? ErrorEnum[checkStatus.message] ?
                      ErrorEnum[checkStatus.message] : checkStatus.message
                    : null }</p>
                  <br/>
                  <Input className={ "login__input" }
                         label={ checkErrors.code ? "Digit code error" : "Digit code" }
                         type={ "text" }
                         mask={ '9999' }
                         maskChar={ '*' }
                         errors={ checkErrors.code ? checkErrors.code : null }
                         InputProps={ {
                           startAdornment: (
                             <InputAdornment position="start">
                               <Sms/>
                             </InputAdornment>
                           ),
                         } }
                         placeholder={ "Digit code" }
                         title={ checkData.code ? checkData.code : null }
                         onChange={ (event) => this.handleCheck('code', event.target.value) }
                  /><br/>
                  <button className="form__submit" onClick={ () => this.handleCheckSubmit() }>
                    <FontAwesomeIcon icon={ faCheck }/>&ensp;
                    Check
                  </button>
                </div> :
                <div className="login__form">
                  <h3>Sign In</h3>
                  <div className="login__form_content">
                    <div className="login__label_row">
                      <label className="login__label">
                        <p>Phone Number</p>
                        <PhoneInput
                          className="login__input"
                          autoComplete="on"
                          value={ formData.phoneNumber ? formData.phoneNumber : "" }
                          errors={ errors.phoneNumber ? ErrorEnum[errors.phoneNumber]
                            ? ErrorEnum[errors.phoneNumber] : errors.phoneNumber : null }
                          title={ formData.phoneNumber ? formData.phoneNumber : null }
                          onChange={ (event) => this.handleChange('phoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
                        />
                      </label>
                      <br/>
                      <label className="login__label">
                        <p>Password</p>
                        <input className="login__input"
                               type="password"
                               autoComplete="on"
                               value={ formData.password ? formData.password : '' }
                               onChange={ (event) => this.handleChange('password', event.target.value) }
                        />
                      </label>
                    </div>
                    <button className="form__submit" onClick={ () => this.handleSubmit() }>
                      Sign In
                    </button>
                    <br/>
                    <p className="input__error">
                      { errors.message ? 'Wrong number or password. Please try again' : null }
                    </p>
                    <p className="input__error">{ loginData.status === false ? ErrorEnum[loginData.message]
                        ? ErrorEnum[loginData.message] : loginData.message
                      : null }</p>
                  </div>
                </div> }
            </div>
          </div>
        </div>
      </WrapperLogout>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.users.errors,
  checkErrors: state.users.checkErrors,
  loginData: state.users.loginData,
  checkStatus: state.users.checkStatus,
});
const mapDispatchToProps = {
  postLoginRequest,
  loginCheck,
  backToLogin
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

export default LoginContainer;
