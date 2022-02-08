import React, { Component } from 'react';
import _ from "lodash";
import { Close } from "@material-ui/icons";
import Input from "../components/form/Input";
import { Button } from "@mui/material";
import { delTransport, getTransport, updateTransport } from "../store/actions/admin/transport";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import ModalButton from "../components/modals/modal";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import { validateInput } from "../helpers/InputValidation";
import SearchSelect from "../components/form/SelectSearch";
import { getCities, getCountries } from "../store/actions/admin/location";
import Selects from "../components/form/Select";
import Transports from "../helpers/Enums";

class DeliveryTransportUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.page,
      formData: {},
    };
  }

  componentDidMount() {
    const {id} = this.state;
    this.props.getTransport(id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const id = this.props.match.params.page;
    const {transportUpdate} = this.props;
    if (prevState.id !== id){
      this.setState({id});
    }
    if (prevProps.transportUpdate !== transportUpdate){
      return this.props.transportUpdate;
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

  handleChange = (path, ev) => {
    const {formData} = this.state;
    _.set(formData, path, ev);
    this.setState({formData})
  }

  handleSubmit = (id) => {
    const {formData} = this.state;
    _.set(formData, 'id', id);
    this.setState({formData});
    this.props.updateTransport(formData).then(async (d) => {
      if (d.payload.data.status === true){
        await this.props.getTransport(id);
        this.setState({formData: {}});
      }
    });
  }

  render() {
    const {
      transportUpdateErr, transport, transportsStatus, transportUpdateStatus, allCountries, allCities
    } = this.props;
    const {formData} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <div className="container">
          { transportsStatus === 'success' && transport ?
            <div className="add__content">
              <div className="user__header">
                <h3 className="users__title">Transport Update</h3>
                <NavLink to={ '/transport' } title="Close"><Close/></NavLink>
              </div>
              <div className="country__filter_area">
                <div className="country__update_content">
                  <label className="country__update_label">
                    <p>Type</p><br/>
                    <Selects
                      size={ "small" }
                      className={ 'user__create_input' }
                      df={ 'Select Type' }
                      data={ Transports }
                      errors={ transportUpdateErr.type ? transportUpdateErr.type.replaceAll('_', ' ') : null }
                      value={ formData.type ? formData.type : transport?.type }
                      vName={ 'name' }
                      keyValue={ 'value' }
                      onChange={ (event) => this.handleChange('type', event.target.value) }
                    />
                  </label>
                  <label className="country__update_label">
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
                      value={ transport ? {
                        value: transport?.id,
                        label: `${ transport?.id }) ${ transport?.deliveryTransportCountry?.name } `,
                      } : '' }
                      errors={ transportUpdateErr.country ? transportUpdateErr.country.replaceAll('_', ' ') : null }
                    />
                  </label>
                  <label className="country__update_label">
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
                      value={ transport ? {
                        value: transport?.id,
                        label: `${ transport?.id }) ${ transport?.deliveryTransportCity?.name } `,
                      } : '' }
                      errors={ transportUpdateErr.city ? transportUpdateErr.city.replaceAll('_', ' ') : null }
                    />
                  </label>
                  <label className='country__update_label'>
                    <p>Price</p><br/>
                    <Input
                      size={ 'small' }
                      defaultValue={ formData.price ? undefined : transport?.price }
                      type={ "number" }
                      className={ `driver__filter_label ${ formData.price && +formData.price !== +transport?.price ? 'in_border' : null }` }
                      inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                      errors={ transportUpdateErr.price ? transportUpdateErr.price : null }
                      placeholder={ "Price" }
                      title={ formData.price }
                      value={ formData.price ? formData.price : formData.price === '' ? '' : undefined }
                      onChange={ (event) => this.handleChange('price', validateInput(event.target.value)) }
                    />
                  </label>
                </div>
                <div className="update__buttons_row">
                  <ModalButton
                    title={ "Delete Transport" }
                    label={ "Delete Transport" }
                    className={ "add__user" }
                    cl={ 'log_out' }
                    text={ "Are you sure you want to delete transport?" }
                    button={ "Delete" }
                    enter={ "Yes" }
                    onClick={ () => this.props.delTransport(transport?.id).then((d) => {
                      if (d.payload.data.status === true){
                        this.props.history.push('/transport');
                      }
                    }) }
                  />
                  <Button onClick={ () => this.handleSubmit(transport?.id) }
                          className={ _.isEmpty(formData) || transportUpdateStatus === "request" ? "" : "add__user" }
                          disabled={ _.isEmpty(formData) || transportUpdateStatus === "request" }
                          variant="contained" title="Save">
                    { transportUpdateStatus === 'request' ? 'Wait...' : 'Save' }
                  </Button>
                </div>
              </div>
            </div>
            : <><br/><p className="center">{ transport ? 'loading...' : 'No such transport' }</p></> }
          <Results/>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  transport: state.transport.transport,
  transportsStatus: state.transport.transportsStatus,
  transportUpdate: state.transport.transportUpdate,
  transportUpdateErr: state.transport.transportUpdateErr,
  transportUpdateStatus: state.transport.transportUpdateStatus,
  allCountries: state.location.allCountries,
  allCities: state.location.allCities,
})

const mapDispatchToProps = {
  getTransport,
  delTransport,
  updateTransport,
  getCountries,
  getCities,
}

const DeliveryTransportUpdateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryTransportUpdate)

export default DeliveryTransportUpdateContainer;
