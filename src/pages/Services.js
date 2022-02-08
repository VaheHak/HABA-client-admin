import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import '../assets/css/pages/service.css'
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";
import { Autorenew, FilterList, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { getServices } from "../store/actions/admin/service";
import Results from "../components/utils/Results";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Input from "../components/form/Input";
import Selects from "../components/form/Select";
import InputRadio from "../components/form/Radio";
import ServiceTable from "../components/tables/serviceTable";
import RangeSlider from "../components/form/Range";
import UserHeader from "../components/UserHeader";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation";
import { getSelectUsers } from "../store/actions/admin/users";
import { getRoutes } from "../store/actions/admin/location";

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        page: 1,
        priceRange: [0, 20000],
      },
      status: [{id: 1, name: "Pending"}, {id: 2, name: "Start Cargo"}, {id: 3, name: "Start Take Passengers"},
        {id: 4, name: "Executing"}, {id: 5, name: "End"}],
    };
  }

  componentDidMount() {
    const {page} = this.props.match.params;
    this.props.getServices(page ? page : 1);
  }

  handleSearchSelect = (path, ev) => {
    const {formData} = this.state;
    if (path === 's'){
      this.props.getSelectUsers(1, ev);
    }
    if (path === 'route'){
      this.props.getRoutes(1, void 0, void 0, ev);
    }
    _.set(formData, 's', ev);
    this.setState({formData});
  }

  handleSelectFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
    this.props.getServices(1, formData.id, formData.toStartDate, formData.fromStartDate, formData.status, formData.type,
      formData.availableCount, formData.ticketPriceRange, formData.ticket, formData.user, formData.route, formData.sort);
    this.props.history.push('/services/1');
  }

  handleChangeFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
  }

  handleSearch = () => {
    const {formData} = this.state;
    this.props.getServices(1, formData.id, formData.toStartDate, formData.fromStartDate, formData.status, formData.type,
      formData.availableCount, formData.ticketPriceRange, formData.ticket, formData.user, formData.route, formData.sort);
    this.props.history.push('/services/1');
  }

  resetAll = () => {
    this.setState({formData: {page: 1, priceRange: [0, 20000]}});
    this.props.getServices(1);
    this.props.history.push(`/services/${ 1 }`);
  }

  render() {
    const {allServices, serviceStatus, serviceGetErr, allUsers, allRoutes, myAccount} = this.props;
    const {formData, status} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <UserHeader title="Service list"/>
        <div className="container">
          <div className="users__content">
            <div className="users__filter_area">
              <ModalButton
                title={ "Filter" }
                label={ "Filter" }
                button={ <FilterList/> }
                input={
                  <div className="users__filter_row">
                    <div className="fLR">
                      <div className="filter__label_row">
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Id" }
                            type={ "number" }
                            value={ formData.id ? formData.id : '' }
                            className="driver__filter_label"
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ serviceGetErr.id ? serviceGetErr.id : null }
                            placeholder={ "Id" }
                            title={ formData.id }
                            autoComplete="on"
                            onChange={ (event) => this.handleChangeFilter('id', validateInput(event.target.value)) }
                          />
                        </label>
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Available Count" }
                            type={ "number" }
                            value={ formData.availableCount ? formData.availableCount : '' }
                            className="driver__filter_label"
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ serviceGetErr.availableCount ? serviceGetErr.availableCount : null }
                            placeholder={ "Available Count" }
                            title={ formData.availableCount }
                            onChange={ (event) => this.handleChangeFilter('availableCount', validateInput(event.target.value)) }
                          />
                        </label>
                      </div>
                      <div className="filter__label_row">
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Ticket" }
                            type={ "number" }
                            value={ formData.ticket ? formData.ticket : '' }
                            className="driver__filter_label"
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ serviceGetErr.ticket ? serviceGetErr.ticket : null }
                            placeholder={ "Ticket id" }
                            title={ formData.ticket }
                            onChange={ (event) => this.handleChangeFilter('ticket', validateInput(event.target.value)) }
                          />
                        </label>
                        <div className="filter_button" onClick={ () => this.handleSearch() }>
                          <Button color="primary" variant="contained" style={ {padding: '8px 16px'} }>
                            <Search fontSize="small"/>
                            Search
                          </Button>
                        </div>
                      </div>
                    </div>
                    <hr/>
                    <br/>
                    <div className="fLR">
                      <label className="filter__label_row">
                        <h5>&ensp;From Start Date</h5><br/>
                        <input type="datetime-local"
                               value={ formData.fromStartDate }
                               className="ticket__filter_input"
                               onChange={ (event) => this.handleSelectFilter('fromStartDate', event.target.value) }/>
                      </label>
                      <label className="filter__label_row">
                        <h5>&ensp;To Start Date</h5><br/>
                        <input type="datetime-local"
                               value={ formData.toStartDate }
                               className="ticket__filter_input"
                               onChange={ (event) => this.handleSelectFilter('toStartDate', event.target.value) }/>
                      </label>
                    </div>
                    <br/>
                    <label className="filter__label_row">
                      <h5>&ensp;User</h5><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose User -'}, ..._.map(allUsers?.array || [], (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.firstName || 'No firstname' } ${ v.lastName
                          || 'No lastname' } | ${ v.phoneNumber || 'No phone' } | ${ v.username || 'No username' }`,
                        }))] }
                        name="User"
                        onFocus={ () => this.props.getSelectUsers(1) }
                        onScrollTop={ () => {
                          if (allUsers?.currentPage > 1){
                            this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage - 1 : 1, formData.s)
                          }
                        } }
                        onScroll={ () => {
                          if (allUsers?.currentPage < allUsers?.totalPages){
                            this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage + 1 : 1, formData.s)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('s', event) }
                        onChange={ (event) => this.handleSelectFilter('user', event?.value) }
                        value={ formData.user ? formData.user : '' }
                        errors={ serviceGetErr.user ? serviceGetErr.user.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <label className="filter__label_row">
                      <h5>&ensp;Route</h5><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose Route -'}, ..._.map(allRoutes?.array || [], (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.routesFrom.name || 'No name' } - ${ v.routesTo.name || 'No name' } `,
                        }))] }
                        name="Route"
                        onFocus={ () => this.props.getRoutes(1) }
                        onScrollTop={ () => {
                          if (allRoutes?.currentPage > 1){
                            this.props.getRoutes(allRoutes?.currentPage ? allRoutes?.currentPage - 1 : 1, void 0, void 0, formData.s)
                          }
                        } }
                        onScroll={ () => {
                          if (allRoutes?.currentPage < allRoutes?.totalPages){
                            this.props.getRoutes(allRoutes?.currentPage ? allRoutes?.currentPage + 1 : 1, void 0, void 0, formData.s)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('route', event) }
                        onChange={ (event) => this.handleSelectFilter('route', event?.value) }
                        value={ formData.route ? formData.route : '' }
                        errors={ serviceGetErr.route ? serviceGetErr.route.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <InputRadio
                      label={ 'Service Type' }
                      data={ [{value: '', name: 'None'}, {value: 1, name: 'Inercity T'}, {
                        value: 2,
                        name: 'Cargo T'
                      }] }
                      value={ formData.type ? +formData.type : '' }
                      onChange={ (event) => this.handleSelectFilter('type', event.target.value) }
                    />
                    <br/>
                    <div className="center">
                      <label className="filter__label_row">
                        <h5>&ensp;Status</h5><br/>
                        <Selects
                          size={ "small" }
                          df={ 'Choose Status' }
                          data={ status }
                          value={ formData.status }
                          title={ formData.status }
                          errors={ serviceGetErr.status ? serviceGetErr.status.replaceAll('_', ' ') : null }
                          vName={ 'name' }
                          keyValue={ 'id' }
                          onChange={ (event) => this.handleSelectFilter('status', event.target.value) }
                        />
                      </label>
                    </div>
                    <br/>
                    <label className="filter__label">
                      <h4>Price range</h4>
                      <br/>
                      <div className="fLR">
                        <p>Min - { formData.priceRange?.[0] }</p>
                        <p>Max - { formData.priceRange?.[1] }</p>
                      </div>
                      <RangeSlider
                        label={ 'Price Range' }
                        value={ formData.priceRange }
                        onChange={ (event, newValue) => this.handleSelectFilter('priceRange', newValue) }
                        onChangeCommitted={ (event, newValue) => this.handleSelectFilter('ticketPriceRange', newValue) }
                      />
                    </label>
                  </div>
                }
              />
              <InputRadio
                label={ 'Sort By - (ASC)' }
                data={ [{value: 1, name: 'Start Date'}, {value: 2, name: 'CreatedAt'}] }
                value={ formData.sort ? +formData.sort : 1 }
                onChange={ (event) => this.handleSelectFilter('sort', event.target.value) }
              />
              <Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
                <Button color="inherit" variant="contained">
                  <Autorenew/>
                </Button>
              </Tooltip>
              { +myAccount.role === 1 ? <Link to='/add_service'>
                <Button title="Add Service" className="add__user" variant="contained">
                  <FontAwesomeIcon icon={ faPlusSquare }/>&ensp;Add Service
                </Button>
              </Link> : null }
            </div>
            { serviceStatus === 'request' ? <p className="center">loading...</p> :
              _.isEmpty(allServices.array) ? <p className="center">No Services</p> :
                <ServiceTable data={ allServices?.array ? allServices.array : [] }
                              role={ myAccount } successFunc={ this.props.getServices }/>
            }
            <br/>
            <br/>
            <div className="center">
              <Pagination
                count={ +allServices?.totalPages } variant="outlined" page={ +allServices?.currentPage }
                shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
                onChange={ (event, page) => {
                  this.props.getServices(page, formData.id, formData.toStartDate, formData.fromStartDate, formData.status, formData.type,
                    formData.availableCount, formData.ticketPriceRange, formData.ticket, formData.user, formData.route, formData.sort);
                } }
                renderItem={ (item) => (
                  <PaginationItem
                    type={ "start-ellipsis" }
                    component={ Link }
                    selected
                    to={ `/services/${ item.page }` }
                    { ...item }
                  />
                ) }
              />
            </div>
            <br/>
          </div>
        </div>
        <Results/>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  myAccount: state.users.myAccount,
  serviceStatus: state.service.serviceStatus,
  allServices: state.service.allServices,
  allUsers: state.users.allUsers,
  allRoutes: state.location.allRoutes,
  serviceGetErr: state.service.serviceGetErr,
})

const mapDispatchToProps = {
  getRoutes,
  getServices,
  getSelectUsers,
}

const ServicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Services)

export default withRouter(ServicesContainer);
