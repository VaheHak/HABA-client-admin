import React, { Component } from 'react';
import _ from "lodash";
import { Close } from "@material-ui/icons";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import Input from "../components/form/Input";
import InputRadio from "../components/form/Radio";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createService, getServices } from "../store/actions/admin/service";
import Selects from "../components/form/Select";
import SearchSelect from "../components/form/SelectSearch";
import { dateToday, validateInput } from "../helpers/InputValidation"
import { Button } from "@mui/material";
import { getRoutes } from "../store/actions/admin/location";
import { getSelectDrivers } from "../store/actions/admin/users";

class AddService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createFormData: {},
      avDrivers: [],
      details: [],
      s: '',
    };
  }

  componentDidMount() {
    this.props.getServices(1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.createFormData !== this.state.createFormData){
      return this.state.createFormData;
    }
    if (prevProps.serviceCreate !== this.props.serviceCreate){
      return this.props.serviceCreate;
    }
  }

  handleSearchSelect = (path, ev) => {
    if (path === 's'){
      this.props.getSelectDrivers(1, ev);
    }
    if (path === 'route'){
      this.props.getRoutes(1, void 0, void 0, ev);
    }
    this.setState({s: ev});
  }

  addDetail = () => {
    const {details} = this.state;
    if (details.length < 2){
      if (details && details?.[0]){
        +details[0]?.type === 1 ? details.push({type: 2}) : details.push({type: 1})
      } else{
        details.push({});
      }
      this.setState({details})
    }
  }
  handleCloseDetail = (i) => {
    const {details, createFormData} = this.state;
    details.splice(i, 1);
    this.setState({
      details,
      createFormData: {...createFormData, details},
    });
  }
  handleChangeDetails = (path, ev, k) => {
    const {details, createFormData} = this.state;
    const {service} = this.props;
    if (path === 'type'){
      if (+k === 1 && details && +details?.[0]?.type !== +ev){
        _.set(details[k], path, ev);
      }
      if (+k === 0 && details && +details?.[1]?.type !== +ev){
        _.set(details[k], path, ev);
      }
    } else if (path === 'maxCount'){
      _.set(details[k], path, ev);
      _.set(details[k], 'availableCount', ev);
    } else if (path === 'availableCount'){
      _.set(details[k], path, +details[k].maxCount >= +ev || +service.details?.maxCount >= +ev ? ev
        : +details[k].maxCount || +service.details?.maxCount);
    } else{
      _.set(details[k], path, ev);
    }
    _.set(createFormData, "details", details);
    this.setState({details, createFormData})
  }

  handleChange = (path, ev) => {
    const {createFormData, avDrivers} = this.state;
    if (path === 'availableDrivers'){
      avDrivers.push(ev);
      _.set(createFormData, path, _.uniq(avDrivers));
      this.setState({avDrivers: _.uniq(avDrivers)})
    } else{
      _.set(createFormData, path, _.trim(ev));
    }
    this.setState({createFormData})
  }

  handleSubmit = () => {
    const {createFormData} = this.state;
    this.setState({createFormData});
    this.props.createService(createFormData).then((d) => {
      if (d.payload.data.status === true){
        this.setState({createFormData: {}, avDrivers: [], details: []});
      }
    })
  }

  closeAvd = (i) => {
    const {avDrivers, createFormData} = this.state;
    avDrivers.splice(i, 1);
    _.set(createFormData, 'availableDrivers', avDrivers);
    this.setState({avDrivers, createFormData});
  }

  render() {
    const {serviceCreateErr, allDrivers, allRoutes, serviceCreateStatus} = this.props;
    const {createFormData, avDrivers, details, s} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <div className="container">
          <div className="add__content">
            <div className="user__header">
              <h3 className="users__title">Add Service</h3>
              <NavLink to={ '/services' } title="Close"><Close/></NavLink>
            </div>
            <div className="country__filter_area">
              <div className="country__update_content">
                <div className="dfa">Add Service Details &ensp;
                  <FontAwesomeIcon icon={ faPlusSquare } className="add__service_button"
                                   onClick={ () => this.addDetail() }
                  /></div>
                <br/>
                <div className="dfj">
                  { _.map(details, (v, k) => (
                    <div className="service_details" key={ k }>
                      <span className="close_details" onClick={ () => this.handleCloseDetail(k) }><Close/></span>
                      <label className='country__update_label'>
                        <p>Service Type</p><br/>
                        <Selects
                          size={ "small" }
                          df={ 'Choose Type' }
                          className="service__details_input"
                          data={ [{id: 1, name: 'Inercity T'}, {id: 2, name: 'Cargo T'}] }
                          value={ v.type }
                          errors={ serviceCreateErr.type ? serviceCreateErr.type : null }
                          vName={ 'name' }
                          keyValue={ 'id' }
                          onChange={ (event) => this.handleChangeDetails('type', event.target.value, k) }
                        />
                      </label>
                      <label className='country__update_label'>
                        <p>Max Count</p><br/>
                        <Input
                          size={ 'small' }
                          type={ "number" }
                          value={ v.maxCount }
                          className="service__details_input"
                          inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                          errors={ serviceCreateErr.maxCount ? serviceCreateErr.maxCount : null }
                          placeholder={ "Max Count" }
                          title={ v.maxCount }
                          onChange={ (event) => this.handleChangeDetails('maxCount', validateInput(event.target.value), k) }
                        />
                      </label>
                      <label className='country__update_label'>
                        <p>Available Count</p><br/>
                        <Input
                          size={ 'small' }
                          value={ v.availableCount ? +v.availableCount : v.maxCount ? +v.maxCount : "" }
                          type={ "number" }
                          className="service__details_input"
                          inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                          errors={ serviceCreateErr.availableCount ? serviceCreateErr.availableCount : null }
                          placeholder={ "Available Count" }
                          title={ v.availableCount }
                          onChange={ (event) => this.handleChangeDetails('availableCount', validateInput(event.target.value), k) }
                        />
                      </label>
                      <label className='country__update_label'>
                        <p>Price</p><br/>
                        <Input
                          size={ 'small' }
                          type={ "number" }
                          value={ v.price }
                          className="service__details_input"
                          inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                          errors={ serviceCreateErr.price ? serviceCreateErr.price : null }
                          placeholder={ "Price" }
                          title={ v.price }
                          onChange={ (event) => this.handleChangeDetails('price', validateInput(event.target.value), k) }
                        />
                      </label>
                    </div>
                  )) }
                </div>
                <br/>
                <label className='country__update_label'>
                  <p>Start Date</p><br/>
                  <input type="datetime-local"
                         value={ createFormData.startDate }
                         className="ticket__filter_input"
                         min={ new Date().toISOString().substring(0, 16) }
                         onChange={ (event) => this.handleChange('startDate', dateToday(event.target.value)) }/>
                  <p className="err">
                    { serviceCreateErr.startDate ? serviceCreateErr.startDate.replaceAll('_', ' ') : null }</p>
                </label>
                <br/>
                <div className="country__update_label">
                  <InputRadio
                    label={ 'State' }
                    data={ [{value: 1, name: "Pending"}, {value: +createFormData.type === 1 ? 3 : 2, name: "Start"},
                      {value: 4, name: "Executing"}, {value: 5, name: "End"}] }
                    value={ createFormData.state ? +createFormData.state : 1 }
                    onChange={ (event) => this.handleChange('state', event.target.value) }
                  />
                </div>
                <label className='country__update_label'>
                  <p>Available Drivers</p><br/>
                  <SearchSelect
                    data={ [{value: "", label: '- Choose Driver -'}, ..._.map(allDrivers?.array || [], (v) => ({
                      value: v.id,
                      label: `${ v.id }) ${ v.driverUser.firstName || 'No firstname' } ${ v.driverUser.lastName ||
                      'No lastname' } | ${ v.driverUser.phoneNumber || 'No phone' } | ${ v.driverUser.username || 'No username' }`,
                    }))] }
                    name="Available Drivers"
                    onFocus={ () => this.props.getSelectDrivers(1) }
                    onScrollTop={ () => {
                      if (allDrivers?.currentPage > 1){
                        this.props.getSelectDrivers(allDrivers?.currentPage ? allDrivers?.currentPage - 1 : 1, s)
                      }
                    } }
                    onScroll={ () => {
                      if (allDrivers?.currentPage < allDrivers?.totalPages){
                        this.props.getSelectDrivers(allDrivers?.currentPage ? allDrivers?.currentPage + 1 : 1, s)
                      }
                    } }
                    onInputChange={ (event) => this.handleSearchSelect('s', event) }
                    onChange={ (event) => this.handleChange('availableDrivers', event?.value) }
                    errors={ serviceCreateErr.availableDrivers ? serviceCreateErr.availableDrivers.replaceAll('_', ' ')
                      : serviceCreateErr.driver ? serviceCreateErr.driver.replaceAll('_', ' ') : null }
                  />
                </label>
                <div className="av_d_b">
                  { _.map(avDrivers, (v, k) => (
                    v ? <div key={ k } className="availableDrivers">
                      <span className="close_avd" onClick={ () => this.closeAvd(k) }><Close/></span>
                      { v })&ensp;
                      { _.find(allDrivers?.array || [], ['id', +v]).driverUser?.firstName || 'None' }&ensp;
                      { _.find(allDrivers?.array || [], ['id', +v]).driverUser?.lastName || 'None' }
                    </div> : null
                  )) }
                </div>
                <br/>
                <label className='country__update_label'>
                  <p>Route</p><br/>
                  <SearchSelect
                    data={ [{value: "", label: '- Choose Route -'}, ..._.map(allRoutes?.array || [], (v) => ({
                      value: v.id,
                      label: `${ v.id }) ${ v.routesFrom.name || 'No name' } - ${ v.routesTo.name || 'No name' } `,
                    }))] }
                    name="Route"
                    onFocus={ () => this.props.getRoutes(1) }
                    onScrollTop={ () => {
                      if (allRoutes?.currentPage > 1){
                        this.props.getRoutes(allRoutes?.currentPage ? allRoutes?.currentPage - 1 : 1, void 0, void 0, s)
                      }
                    } }
                    onScroll={ () => {
                      if (allRoutes?.currentPage < allRoutes?.totalPages){
                        this.props.getRoutes(allRoutes?.currentPage ? allRoutes?.currentPage + 1 : 1, void 0, void 0, s)
                      }
                    } }
                    onInputChange={ (event) => this.handleSearchSelect('route', event) }
                    onChange={ (event) => this.handleChange('route', event?.value) }
                    value={ createFormData.route ? createFormData.route : '' }
                    errors={ serviceCreateErr.route ? serviceCreateErr.route : null }
                  />
                </label>
                <label className='country__update_label'>
                  <p>Driver Minimum Salary</p><br/>
                  <Input
                    size={ 'small' }
                    type={ "number" }
                    value={ createFormData.driverMinimumSalary }
                    className="driver__filter_label"
                    inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                    errors={ serviceCreateErr.driverMinimumSalary ? serviceCreateErr.driverMinimumSalary : null }
                    placeholder={ "Driver Minimum Salary" }
                    title={ createFormData.driverMinimumSalary }
                    onChange={ (event) => this.handleChange('driverMinimumSalary', validateInput(event.target.value)) }
                  />
                </label>
                <label className='country__update_label'>
                  <p>Paid Salary</p><br/>
                  <Input
                    size={ 'small' }
                    type={ "number" }
                    value={ createFormData.paidSalary }
                    className="driver__filter_label"
                    inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                    errors={ serviceCreateErr.paidSalary ? serviceCreateErr.paidSalary : null }
                    placeholder={ "Paid Salary" }
                    title={ createFormData.paidSalary }
                    onChange={ (event) => this.handleChange('paidSalary', validateInput(event.target.value)) }
                  />
                </label>
              </div>
              <div className="update__buttons_row">
                <NavLink to='/services'>
                  <Button title="Cancel" className="add__user" variant="contained">
                    Cancel
                  </Button>
                </NavLink>
                <Button onClick={ this.handleSubmit }
                        className={ _.isEmpty(createFormData) || serviceCreateStatus === "request" ? "" : "add__user" }
                        disabled={ _.isEmpty(createFormData) || serviceCreateStatus === "request" }
                        variant="contained" title="Save">
                  { serviceCreateStatus === 'request' ? 'Wait...' : 'Submit' }
                </Button>
              </div>
            </div>
          </div>
          <Results/>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  serviceCreate: state.service.serviceCreate,
  serviceCreateErr: state.service.serviceCreateErr,
  serviceCreateStatus: state.service.serviceCreateStatus,
  allDrivers: state.users.allDrivers,
  allRoutes: state.location.allRoutes,
})

const mapDispatchToProps = {
  getRoutes,
  getServices,
  getSelectDrivers,
  createService,
}

const AddServiceContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddService)

export default AddServiceContainer;
