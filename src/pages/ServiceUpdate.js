import React, { Component } from 'react';
import _ from "lodash";
import { Close } from "@material-ui/icons";
import { Button } from "@mui/material";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import { deletingService, getService, updateService } from "../store/actions/admin/service";
import Input from "../components/form/Input";
import InputRadio from "../components/form/Radio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Selects from "../components/form/Select";
import ModalButton from "../components/modals/modal";
import moment from "moment-timezone";
import SearchSelect from "../components/form/SelectSearch";
import { dateToday, validateInput } from "../helpers/InputValidation";
import { getRoutes } from "../store/actions/admin/location";
import { getSelectDrivers } from "../store/actions/admin/users";

class ServiceUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.page,
      updateFormData: {},
      avDrivers: [],
      details: [],
      s: '',
    };
  }

  componentDidMount() {
    const {id} = this.state;
    this.props.getService(id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const id = this.props.match.params.page;
    const {service} = this.props;
    if (prevState.id !== id){
      this.setState({id});
    }
    if (prevState.updateFormData !== this.state.updateFormData){
      return this.state.updateFormData;
    }
    if (prevProps.serviceUpdate !== this.props.serviceUpdate){
      return this.props.serviceUpdate;
    }
    if (service && prevState.details !== service.details){
      this.setState({details: service.details});
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
    const {details, updateFormData} = this.state;
    details.splice(i, 1);
    this.setState({
      details,
      updateFormData: {...updateFormData, details},
    });
  }
  handleDeleteDetail = (ev) => {
    const {updateFormData, id} = this.state;
    _.set(updateFormData, "deleteDetailId", ev);
    _.set(updateFormData, "id", id);
    this.props.updateService(updateFormData).then((d) => {
      if (d.payload.data.status === true){
        this.props.getService(id);
        this.setState({updateFormData: {}});
      }
    })
  }
  handleChangeDetails = (path, ev, k) => {
    const {details, updateFormData} = this.state;
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
      _.set(details[k], path, +details[k].maxCount >= +ev ? ev : +details[k].maxCount || '');
    } else{
      _.set(details[k], path, ev);
    }
    _.set(updateFormData, "details", details);
    this.setState({details, updateFormData})
  }

  handleChange = (path, ev) => {
    const {updateFormData, avDrivers} = this.state;
    if (path === 'availableDrivers'){
      avDrivers.push(ev);
      _.set(updateFormData, path, _.uniq(avDrivers));
      this.setState({avDrivers: _.uniq(avDrivers)})
    } else{
      _.set(updateFormData, path, _.trim(ev));
    }
    this.setState({updateFormData})
  }

  handleSubmit = (ev) => {
    const {updateFormData} = this.state;
    _.set(updateFormData, "id", ev);
    this.setState({updateFormData});
    this.props.updateService(updateFormData).then((d) => {
      if (d.payload.data.status === true){
        this.props.getService(ev);
        this.setState({updateFormData: {}, avDrivers: []});
      }
    })
  }

  closeAvd = (i) => {
    const {avDrivers, updateFormData} = this.state;
    avDrivers.splice(i, 1);
    _.set(updateFormData, 'availableDrivers', avDrivers);
    this.setState({avDrivers, updateFormData});
  }

  deleteAvDriver = (i) => {
    const {updateFormData, id} = this.state;
    _.set(updateFormData, 'delAvailableDriverId', i);
    this.props.updateService(updateFormData).then(async (d) => {
      if (d.payload.data.status === true){
        await this.props.getService(id);
        this.setState({updateFormData: {}});
      }
    });
  }

  render() {
    const {serviceUpdateErr, allDrivers, allRoutes, service, serviceStatus, serviceUpdateStatus} = this.props;
    const {updateFormData, avDrivers, details, s} = this.state;
    const r = _.find(allRoutes?.array || [], ['id', +service.routeId])

    return (
      <Wrapper showFooter={ false }>
        <div className="container">
          { serviceStatus === 'success' && service ?
            <div className="add__content">
              <div className="user__header">
                <h3 className="users__title">Edit Service</h3>
                <NavLink to={ '/services' } title="Close"><Close/></NavLink>
              </div>
              <div className="country__filter_area">
                <div className="country__update_content">
                  <div className="service_create__date">
                    <p>Created at { moment(service?.createdAt).format('DD.MM.YYYY') }</p>
                    <p>Updated at { moment(service?.updatedAt).format('DD.MM.YYYY') }</p>
                  </div>
                  <br/>
                  <div className="dfa">Add Service Details &ensp;
                    <FontAwesomeIcon icon={ faPlusSquare } className="add__service_button"
                                     onClick={ () => this.addDetail() }
                    /></div>
                  <br/>
                  <div className="dfj">
                    { _.map(details, (v, k) => (
                      v ? <div className="service_details" key={ k }>
                        <span className="close_details" onClick={ () => {
                          if (v.id){
                            this.handleDeleteDetail(v.id);
                            this.handleCloseDetail(k)
                          } else{
                            this.handleCloseDetail(k)
                          }
                        } }><Close/></span>
                        <label className='country__update_label'>
                          <p>Service Type</p><br/>
                          <Selects
                            size={ "small" }
                            df={ 'Choose Type' }
                            className={ `service__details_input ${ v.type && v.type !== v?.type
                              ? 'in_border' : null }` }
                            data={ [{id: 1, name: 'Inercity T'}, {id: 2, name: 'Cargo T'}] }
                            value={ v?.type ? v.type : "" }
                            errors={ serviceUpdateErr.type ? serviceUpdateErr.type : null }
                            vName={ 'name' }
                            keyValue={ 'id' }
                            onChange={ (event) => this.handleChangeDetails('type', event.target.value, k) }
                          />
                        </label>
                        <label className='country__update_label'>
                          <p>Max Count</p><br/>
                          <Input
                            size={ 'small' }
                            value={ v.maxCount ? +v.maxCount : v.maxCount === '' ? '' : "" }
                            type={ "number" }
                            className={ `service__details_input ${ v.maxCount && +v.maxCount
                            !== +v?.maxCount ? 'in_border' : null }` }
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ serviceUpdateErr.maxCount ? serviceUpdateErr.maxCount : null }
                            placeholder={ "Max Count" }
                            title={ v.maxCount }
                            onChange={ (event) => this.handleChangeDetails('maxCount', validateInput(event.target.value), k) }
                          />
                        </label>
                        <label className='country__update_label'>
                          <p>Available Count</p><br/>
                          <Input
                            size={ 'small' }
                            defaultValue={ +v?.maxCount }
                            value={ v.availableCount === '' ? '' : v.availableCount ? +v.availableCount
                              : v.maxCount ? +v.maxCount : "" }
                            type={ "number" }
                            className={ `service__details_input ${ v.availableCount && +v.availableCount
                            !== +v?.availableCount ? 'in_border' : null }` }
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ serviceUpdateErr.availableCount ? serviceUpdateErr.availableCount : null }
                            placeholder={ "Available Count" }
                            title={ v.availableCount }
                            onChange={ (event) => this.handleChangeDetails('availableCount', validateInput(event.target.value), k) }
                          />
                        </label>
                        <label className='country__update_label'>
                          <p>Price</p><br/>
                          <Input
                            size={ 'small' }
                            value={ v?.price ? +v.price : v.price === '' ? '' : "" }
                            type={ "number" }
                            className={ `service__details_input ${ v.price && +v.price !== +v?.price
                              ? 'in_border' : null }` }
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ serviceUpdateErr.price ? serviceUpdateErr.price : null }
                            placeholder={ "Price" }
                            title={ v.price }
                            onChange={ (event) => this.handleChangeDetails('price', validateInput(event.target.value), k) }
                          />
                        </label>
                      </div> : null
                    )) }
                  </div>
                  <br/>
                  <label className='country__update_label'>
                    <p>Start Date</p><br/>
                    <input type="datetime-local"
                           value={ updateFormData.startDate ? updateFormData.startDate : service.startDate ? moment(service.startDate).tz('UTC').format('yyyy-MM-DDThh:mm') : '' }
                           className="ticket__filter_input"
                           style={ {
                             border: updateFormData.startDate && updateFormData.startDate !== service?.startDate
                               ? '2px solid black' : null
                           } }
                           min={ new Date().toISOString().substring(0, 16) }
                           onChange={ (event) => this.handleChange('startDate', dateToday(event.target.value)) }/>
                    <p className="err">
                      { serviceUpdateErr.startDate ? serviceUpdateErr.startDate.replaceAll('_', ' ') : null }</p>
                  </label>
                  <br/>
                  <div className="country__update_label">
                    <InputRadio
                      label={ 'State' }
                      data={ [{value: 1, name: "Pending"}, {value: +details?.[0]?.type === 1 ? 2 : 3, name: "Start"},
                        {value: 4, name: "Executing"}, {value: 5, name: "End"}] }
                      value={ updateFormData.state ? +updateFormData.state : service.state ? +service.state : 1 }
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
                      errors={ serviceUpdateErr.availableDrivers ? serviceUpdateErr.availableDrivers.replaceAll('_', ' ')
                        : serviceUpdateErr.driver ? serviceUpdateErr.driver.replaceAll('_', ' ') : null }
                    />
                  </label>
                  <div className="av_d_b">
                    { _.map(service.driversAvailable || [], (v, k) => (
                      v ? <div key={ k } className="availableDrivers">
                        <span className="close_avd err" style={ {borderColor: "red"} } title="Delete"
                              onClick={ () => this.deleteAvDriver(v?.id) }><Close/></span>
                        { v.id })&ensp;
                        { v?.driverUser?.firstName || 'None' }&ensp;
                        { v?.driverUser?.lastName || 'None' }
                      </div> : null
                    )) }
                    { _.map(avDrivers, (v, k) => (
                      v ? <div key={ k } className="availableDrivers">
                        <span className="close_avd" onClick={ () => this.closeAvd(k) }><Close/></span>
                        { v })&ensp;
                        { _.find(allDrivers?.array || [], ['id', +v]).driverUser?.firstName || 'No name' }&ensp;
                        { _.find(allDrivers?.array || [], ['id', +v]).driverUser?.lastName || 'No surname' }
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
                      value={ r ? {
                        value: r?.id,
                        label: `${ r?.id }) ${ r?.routesFrom?.name } - ${ r?.routesTo?.name } `,
                      } : '' }
                      errors={ serviceUpdateErr.route ? serviceUpdateErr.route : null }
                    />
                  </label>
                  <label className='country__update_label'>
                    <p>Driver Minimum Salary</p><br/>
                    <Input
                      size={ 'small' }
                      defaultValue={ service.driverMinimumSalary }
                      type={ "number" }
                      className={ `driver__filter_label ${ updateFormData.driverMinimumSalary
                      && +updateFormData.driverMinimumSalary !== +service?.driverMinimumSalary ? 'in_border' : null }` }
                      inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                      errors={ serviceUpdateErr.driverMinimumSalary ? serviceUpdateErr.driverMinimumSalary : null }
                      placeholder={ "Driver Minimum Salary" }
                      title={ updateFormData.driverMinimumSalary }
                      onChange={ (event) => this.handleChange('driverMinimumSalary', validateInput(event.target.value)) }
                    />
                  </label>
                  <label className='country__update_label'>
                    <p>Paid Salary</p><br/>
                    <Input
                      size={ 'small' }
                      defaultValue={ service.paidSalary }
                      type={ "number" }
                      className={ `driver__filter_label ${ updateFormData.paidSalary && +updateFormData.paidSalary !== +service?.paidSalary
                        ? 'in_border' : null }` }
                      inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                      errors={ serviceUpdateErr.paidSalary ? serviceUpdateErr.paidSalary : null }
                      placeholder={ "Paid Salary" }
                      title={ updateFormData.paidSalary }
                      onChange={ (event) => this.handleChange('paidSalary', validateInput(event.target.value)) }
                    />
                  </label>
                </div>
                <div className="update__buttons_row">
                  <ModalButton
                    title={ "Delete Service" }
                    label={ "Delete Service" }
                    className={ "add__user" }
                    cl={ 'log_out' }
                    text={ "Are you sure you want to delete service?" }
                    button={ "Delete" }
                    enter={ "Yes" }
                    onClick={ () => this.props.deletingService(service?.id).then((d) => {
                      if (d.payload.data.status === true){
                        this.props.getService(service?.id);
                        this.props.history.push('/services');
                      }
                    }) }
                  />
                  <Button onClick={ () => this.handleSubmit(service?.id) }
                          className={ _.isEmpty(updateFormData) || serviceUpdateStatus === "request" ? "" : "add__user" }
                          disabled={ _.isEmpty(updateFormData) || serviceUpdateStatus === "request" }
                          variant="contained" title="Save">
                    { serviceUpdateStatus === 'request' ? 'Wait...' : 'Save' }
                  </Button>
                </div>
              </div>
            </div>
            : <><br/><p className="center">{ service ? 'loading...' : 'No such service' }</p></> }
          <Results/>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  service: state.service.service,
  serviceStatus: state.service.serviceStatus,
  serviceUpdate: state.service.serviceUpdate,
  serviceUpdateErr: state.service.serviceUpdateErr,
  serviceUpdateStatus: state.service.serviceUpdateStatus,
  allDrivers: state.users.allDrivers,
  allRoutes: state.location.allRoutes,
})

const mapDispatchToProps = {
  getRoutes,
  getService,
  getSelectDrivers,
  updateService,
  deletingService,
}

const ServiceUpdateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceUpdate)

export default ServiceUpdateContainer;
