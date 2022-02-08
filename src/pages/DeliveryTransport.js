import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import _ from "lodash";
import { Button, Tooltip } from "@mui/material";
import { Autorenew, FilterList, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCar } from "@fortawesome/free-solid-svg-icons";
import Input from "../components/form/Input";
import UserHeader from "../components/UserHeader";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation"
import { connect } from "react-redux";
import { Pagination, PaginationItem } from "@mui/lab";
import Results from "../components/utils/Results";
import { createTransport, getTransports } from "../store/actions/admin/transport";
import TransportTable from "../components/tables/transportTable";
import { getCities, getCountries } from "../store/actions/admin/location";
import Selects from "../components/form/Select";
import Transports from "../helpers/Enums";

class DeliveryTransport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createFormData: {},
      formData: {
        page: 1,
      },
    };
  }

  componentDidMount() {
    const {page} = this.props.match.params;
    this.props.getTransports(page ? page : 1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.transportCreate !== this.props.transportCreate){
      return this.props.transportCreate;
    }
  }

  handleSearchSelect = (path, ev) => {
    if (path === 'country'){
      this.props.getCountries(1, void 0, void 0, void 0, ev);
    }
    if (path === 'city'){
      this.props.getCities(1, void 0, void 0, void 0, ev);
    }
  }

  handleSelectFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
    this.props.getTransports(formData.page, formData.id, formData.type, formData.country, formData.city, formData.price)
  }

  handleChangeFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
  }

  handleSearch = () => {
    const {formData} = this.state;
    this.props.getTransports(formData.page, formData.id, formData.type, formData.country, formData.city, formData.price)
  }

  handleChange = (path, value) => {
    const {createFormData} = this.state;
    _.set(createFormData, path, value);
    this.setState({createFormData});
  };

  handleSubmit = () => {
    const {createFormData} = this.state;
    this.props.createTransport(createFormData).then((d) => {
      if (d.payload.data.status === true){
        this.props.getTransports(1);
        this.setState({createFormData: {}});
      }
    })
  }

  resetAll = () => {
    this.setState({createFormData: {}, formData: {page: 1}});
    this.props.getTransports(1);
    this.props.history.push(`/transport/${ 1 }`);
  }

  render() {
    const {
      allTransports, transportGetError, transportCreateStatus, transportCreateErr, allCountries, allCities
    } = this.props;
    const {createFormData, formData} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <UserHeader title="Transport list"/>
        <div className="container">
          <div className="users__content">
            <div className="users__filter_area">
              <ModalButton
                title={ "Filter" }
                label={ "Filter" }
                button={ <FilterList/> }
                input={
                  <div className="users__filter_row">
                    <label className="filter__label_row">
                      <h5>&ensp;Country</h5><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose Country -'}, ..._.map(allCountries?.array || [], (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.name || 'No name' }`,
                        }))] }
                        name="Country"
                        onFocus={ () => this.props.getCountries(1) }
                        onScrollTop={ () => {
                          if (allCountries?.currentPage > 1){
                            this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage - 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onScroll={ () => {
                          if (allCountries?.currentPage < allCountries?.totalPages){
                            this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage + 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('country', event) }
                        onChange={ (event) => this.handleSelectFilter('country', event?.value) }
                        value={ formData.country ? formData.country : '' }
                        errors={ transportGetError.country ? transportGetError.country.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <label className="filter__label_row">
                      <h5>&ensp;City</h5><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose City -'}, ..._.map(allCities?.array || [], (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.name || 'No name' }`,
                        }))] }
                        name="City"
                        onFocus={ () => this.props.getCities(1) }
                        onScrollTop={ () => {
                          if (allCities?.currentPage > 1){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage - 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onScroll={ () => {
                          if (allCities?.currentPage < allCities?.totalPages){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage + 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('city', event) }
                        onChange={ (event) => this.handleSelectFilter('city', event?.value) }
                        value={ formData.city ? formData.city : '' }
                        errors={ transportGetError.city ? transportGetError.city.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <label className="filter__label_row">
                      <h5>&ensp;Type</h5><br/>
                      <Selects
                        size={ "small" }
                        className={ 'user__create_input' }
                        df={ 'Select Type' }
                        data={ Transports }
                        errors={ transportCreateErr.type ? transportCreateErr.type.replaceAll('_', ' ') : null }
                        value={ createFormData.type ? createFormData.type : '' }
                        vName={ 'name' }
                        keyValue={ 'value' }
                        onChange={ (event) => this.handleSelectFilter('type', event.target.value) }
                      />
                    </label>
                    <br/>
                    <br/>
                    <hr/>
                    <br/>
                    <div className="fLR">
                      <div className="filter__label_row">
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Id" }
                            type={ "number" }
                            value={ formData.id ? formData.id : '' }
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ transportGetError?.id ? transportGetError.id : null }
                            placeholder={ "Id" }
                            title={ formData.id }
                            autoComplete="on"
                            onChange={ (event) => this.handleChangeFilter('id', validateInput(event.target.value)) }
                          />
                        </label>
                      </div>
                      <div className="filter__label_row">
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Price" }
                            type={ "number" }
                            value={ formData.price ? formData.price : '' }
                            className={ 'driver__filter_label' }
                            errors={ transportGetError?.price ? transportGetError.price.replaceAll('_', ' ') : null }
                            placeholder={ "Price" }
                            title={ formData.price }
                            autoComplete="on"
                            onChange={ (event) => this.handleChangeFilter('price', validateInput(event.target.value)) }
                          />
                        </label>
                      </div>
                    </div>
                    <div className="filter_button" onClick={ () => this.handleSearch() }>
                      <Button color="primary" variant="contained">
                        <Search fontSize="small"/>
                        Search
                      </Button>
                    </div>
                    <br/>
                  </div>
                }
              />
              <Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
                <Button color="inherit" variant="contained">
                  <Autorenew/>
                </Button>
              </Tooltip>
              <ModalButton
                title={ "Add Transport" }
                label={ "Add Transport" }
                button={ <><FontAwesomeIcon icon={ faCar }/>&ensp;Add Transport</> }
                enter={ transportCreateStatus === 'request' ? 'Wait...' : "Submit" }
                className={ "add__user" }
                c={ true }
                onClick={ () => transportCreateStatus === 'request' ? null : this.handleSubmit() }
                input={
                  <div className="user__create_content">
                    <label className="user__create_label">
                      <p>Transport Type</p><br/>
                      <Selects
                        size={ "small" }
                        className={ 'user__create_input' }
                        df={ 'Choose Type' }
                        data={ Transports }
                        errors={ transportCreateErr.type ? transportCreateErr.type.replaceAll('_', ' ') : null }
                        value={ createFormData.type ? createFormData.type : '' }
                        vName={ 'name' }
                        keyValue={ 'value' }
                        onChange={ (event) => this.handleChange('type', event.target.value) }
                      />
                    </label>
                    <label className="user__create_label">
                      <h5>&ensp;Country</h5><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose Country -'}, ..._.map(allCountries?.array || [], (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.name || 'No name' }`,
                        }))] }
                        name="Country"
                        onFocus={ () => this.props.getCountries(1) }
                        onScrollTop={ () => {
                          if (allCountries?.currentPage > 1){
                            this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage - 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onScroll={ () => {
                          if (allCountries?.currentPage < allCountries?.totalPages){
                            this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage + 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('country', event) }
                        onChange={ (event) => this.handleChange('country', event?.value) }
                        value={ createFormData.country ? createFormData.country : {
                          value: '',
                          label: '- Choose Country -'
                        } }
                        errors={ transportCreateErr.country ? transportCreateErr.country.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <label className="user__create_label">
                      <h5>&ensp;City</h5><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose City -'}, ..._.map(allCities?.array || [], (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.name || 'No name' }`,
                        }))] }
                        name="City"
                        onFocus={ () => this.props.getCities(1) }
                        onScrollTop={ () => {
                          if (allCities?.currentPage > 1){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage - 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onScroll={ () => {
                          if (allCities?.currentPage < allCities?.totalPages){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage + 1 : 1,
                              void 0, void 0, void 0, formData.s)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('city', event) }
                        onChange={ (event) => this.handleChange('city', event?.value) }
                        value={ createFormData.city ? createFormData.city : {value: '', label: '- Choose City -'} }
                        errors={ transportCreateErr.city ? transportCreateErr.city.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <label className="user__create_label">
                      <p>Price</p><br/>
                      <Input
                        size={ 'small' }
                        type={ "text" }
                        mask={ "999999999999999999999999999999" }
                        maskChar={ '' }
                        className={ 'user__create_input' }
                        errors={ transportCreateErr.price ? transportCreateErr.price : null }
                        placeholder={ "Price" }
                        title={ createFormData.price }
                        value={ createFormData.price ? createFormData.price : '' }
                        onChange={ (event) => this.handleChange('price', event.target.value) }
                      />
                    </label>
                  </div>
                }
              />
            </div>
            { _.isEmpty(allTransports.array) ? <p className="center">No Transports</p> :
              <TransportTable data={ allTransports.array ? allTransports.array : [] }/> }
            <br/>
            <br/>
            <div className="center">
              <Pagination
                count={ +allTransports?.totalPages } variant="outlined" page={ +allTransports?.currentPage }
                shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
                onChange={ (event, page) => {
                  this.handleSelectFilter('page', page);
                } }
                renderItem={ (item) => (
                  <PaginationItem
                    type={ "start-ellipsis" }
                    component={ Link }
                    selected
                    to={ `/transport/${ item.page }` }
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
  allTransports: state.transport.allTransports,
  transportGetError: state.transport.transportGetError,
  transportCreate: state.transport.transportCreate,
  transportCreateErr: state.transport.transportCreateErr,
  transportCreateStatus: state.transport.transportCreateStatus,
  allCountries: state.location.allCountries,
  allCities: state.location.allCities,
})

const mapDispatchToProps = {
  getTransports,
  createTransport,
  getCountries,
  getCities,
}

const DeliveryTransportContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryTransport)

export default withRouter(DeliveryTransportContainer);
