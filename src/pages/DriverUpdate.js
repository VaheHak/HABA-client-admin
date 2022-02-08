import React, { Component } from 'react';
import _ from "lodash";
import { Close } from "@material-ui/icons";
import Input from "../components/form/Input";
import { Button } from "@mui/material";
import { deletingDriver, getDriver, updateDriver } from "../store/actions/admin/users";
import { connect } from "react-redux";
import moment from "moment";
import Wrapper from "../components/Wrapper";
import ModalButton from "../components/modals/modal";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import SelectYear from "../components/form/SelectYear";
import SelectNumber from "../components/form/SelectNumber";
import TypeCheckbox from "../components/form/TypeCheckbox";

class DriverUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.page,
      formData: {},
    };
  }

  componentDidMount() {
    const {id} = this.state;
    this.props.getDriver(id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const id = this.props.match.params.page;
    const {driverUpdate} = this.props;
    if (prevState.id !== id){
      this.setState({id});
    }
    if (prevProps.driverUpdate !== driverUpdate){
      return this.props.driverUpdate;
    }
  }

  handleChange = (path, ev) => {
    const {formData} = this.state;
    _.set(formData, path, path === 'carYear' ? new Date(ev).getFullYear() : ev);
    if (path === "carYear"){
      _.set(formData, "fullDate", _.trim(ev));
    }
    this.setState({formData})
  }

  handleSubmit = (id) => {
    const {formData} = this.state;
    _.set(formData, 'id', id);
    this.setState({formData});
    this.props.updateDriver(formData).then(async (d) => {
      if (d.payload.data.status === true){
        await this.props.getDriver(id);
        this.setState({formData: {}});
      }
    });
  }

  render() {
    const {driverUpdateErr, driver, driversStatus, driverUpdateStatus} = this.props;
    const {formData} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <div className="container">
          { driversStatus === 'success' && driver ?
            <div className="add__content">
              <div className="user__header">
                <h3 className="users__title">Driver Update</h3>
                <NavLink to={ '/drivers' } title="Close"><Close/></NavLink>
              </div>
              <div className="users__filter_area">
                <span className="create__date">
                  <p>Created at { moment(driver?.createdAt).format('DD.MM.YYYY') }</p>
                  <p>Updated at { moment(driver?.updatedAt).format('DD.MM.YYYY') }</p>
                </span>
                <div className="update__buttons_row">
                  <ModalButton
                    title={ "Delete" }
                    label={ "Delete Driver" }
                    className={ "add__user" }
                    cl={ 'log_out' }
                    text={ "Are you sure you want to delete this driver?" }
                    button={ "Delete Driver" }
                    enter={ "Yes" }
                    onClick={ () => this.props.deletingDriver(driver?.id).then(() => this.props.history.push('/drivers')) }
                  />
                  <Button onClick={ () => this.handleSubmit(driver?.id) }
                          className={ _.isEmpty(formData) || driverUpdateStatus === "request" ? "" : "add__user" }
                          disabled={ _.isEmpty(formData) || driverUpdateStatus === "request" }
                          variant="contained" title="Save">
                    { driverUpdateStatus === "request" ? 'Wait...' : 'Save' }
                  </Button>
                </div>
              </div>
              <label className="user__update_label">
                <p>User</p><br/>
                <Input
                  size={ "small" }
                  disabled
                  InputProps={ {
                    readOnly: true,
                  } }
                  title={ formData.userId }
                  value={ `${ driver?.userId }) ${ driver.driverUser?.firstName || 'name' } ${ driver.driverUser?.lastName
                  || 'surname' } | ${ driver.driverUser?.phoneNumber || 'phone' } | ${ driver.driverUser?.username || 'username' }` }
                />
              </label>
              <label className="user__update_label">
                <TypeCheckbox
                  label={ 'Type' }
                  label1={ 'Out city' }
                  label2={ 'In city' }
                  onChange={ this.handleChange }
                  path={ 'type' }
                  value={ driver?.type }
                />
                <p className="err">{ driverUpdateErr.type ? driverUpdateErr.type : null }</p>
              </label>
              <label className="user__update_label">
                <p>Car Make</p><br/>
                <Input
                  size={ 'small' }
                  defaultValue={ driver.driverCars?.make }
                  type={ "text" }
                  mask={ "******************************" }
                  maskChar={ '' }
                  className={ `user__create_input ${ formData.carMake && formData.carMake !== driver.driverCars?.make
                    ? 'in_border' : null }` }
                  errors={ driverUpdateErr.carMake ? driverUpdateErr.carMake.replaceAll('_', ' ') : null }
                  placeholder={ "Car Make" }
                  title={ formData.carMake }
                  onChange={ (event) => this.handleChange('carMake', event.target.value) }
                />
              </label>
              <label className="user__update_label">
                <p>Car Model</p><br/>
                <Input
                  size={ 'small' }
                  defaultValue={ driver.driverCars?.model }
                  type={ "text" }
                  mask={ "******************************" }
                  maskChar={ '' }
                  className={ `user__create_input ${ formData.carModel && formData.carModel !== driver.driverCars?.model
                    ? 'in_border' : null }` }
                  errors={ driverUpdateErr.carModel ? driverUpdateErr.carModel.replaceAll('_', ' ') : null }
                  placeholder={ "Car Model" }
                  title={ formData.carModel }
                  onChange={ (event) => this.handleChange('carModel', event.target.value) }
                />
              </label>
              <label className="driver__update_label">
                <div style={ {display: "flex"} }>
                  Car Color -&ensp;
                  <div style={ {background: driver.driverCars?.color} } className="car_color"/>
                </div>
                <br/>
                <Input
                  size={ "small" }
                  placeholder={ "Color" }
                  defaultValue={ _.upperFirst(driver.driverCars?.color) }
                  title={ formData.carColor }
                  mask={ "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
                  maskChar={ '' }
                  className={ `${ formData.carColor && formData.carColor !== driver.driverCars?.color ? 'in_border' : null }` }
                  errors={ driverUpdateErr.carColor ? driverUpdateErr.carColor.replaceAll('_', ' ') : null }
                  onChange={ (event) => this.handleChange('carColor', event.target.value) }
                />
              </label>
              <label className="driver__update_label">
                <p>Car Year</p><br/>
                <SelectYear
                  className={ `select_year ${ formData.fullDate && formData.fullDate !== driver.driverCars?.year ? 'in_border' : null }` }
                  label={ 'Choose Year' }
                  value={ formData.fullDate }
                  title={ formData.carYear }
                  errors={ driverUpdateErr.carYear ? driverUpdateErr.carYear.replaceAll('_', ' ') : null }
                  onChange={ (newValue) => this.handleChange('carYear', +newValue) }
                  defaultValue={ driver.driverCars?.year }
                />
              </label>
              <label className="driver__update_label">
                <p>Car Passangers Seat</p><br/>
                <SelectNumber
                  plus={ true }
                  className={ `${ formData.carPassengersSeat && +formData.carPassengersSeat !== +driver.driverCars?.passengersSeat
                    ? 'in_border' : null }` }
                  value={ formData.carPassengersSeat ? formData.carPassengersSeat : +driver.driverCars?.passengersSeat || "" }
                  data={ Array.from(Array(21).keys()) }
                  errors={ driverUpdateErr.carPassengersSeat ? driverUpdateErr.carPassengersSeat.replaceAll('_', ' ') : null }
                  onChange={ (event) => this.handleChange('carPassengersSeat', event.target.value) }
                />
              </label>
              <label className="user__update_label">
                <p>Car Number</p><br/>
                <Input
                  size={ 'small' }
                  defaultValue={ driver.driverCars?.number }
                  type={ "text" }
                  mask={ "******************************" }
                  maskChar={ '' }
                  className={ `user__create_input ${ formData.carNumber && formData.carNumber !== driver.driverCars?.number
                    ? 'in_border' : null }` }
                  errors={ driverUpdateErr.carNumber ? driverUpdateErr.carNumber.replaceAll('_', ' ') : null }
                  placeholder={ "Car Number" }
                  title={ formData.carNumber }
                  onChange={ (event) => this.handleChange('carNumber', event.target.value) }
                />
              </label>
            </div>
            : <><br/><p className="center">{ driver ? 'loading...' : 'No such driver' }</p></> }
          <Results/>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  driver: state.users.driver,
  driversStatus: state.users.driversStatus,
  driverUpdate: state.users.driverUpdate,
  driverUpdateErr: state.users.driverUpdateErr,
  driverUpdateStatus: state.users.driverUpdateStatus,
})

const mapDispatchToProps = {
  getDriver,
  deletingDriver,
  updateDriver,
}

const DriverUpdateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DriverUpdate)

export default DriverUpdateContainer;
