import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import '../assets/css/pages/partner.css'
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";
import { Autorenew, FilterList, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { getPartners, getSelectUsers } from "../store/actions/admin/users";
import Results from "../components/utils/Results";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Input from "../components/form/Input";
import UserHeader from "../components/UserHeader";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import PartnerTable from "../components/tables/partnerTable";
import { getCities, getCountries } from "../store/actions/admin/location";

class Partner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        page: 1,
      },
    };
  }

  componentDidMount() {
    const {page} = this.props.match.params;
    this.props.getPartners(page ? page : 1);
  }

  handleSearchSelect = (path, ev) => {
    const {formData} = this.state;
    if (path === 's'){
      this.props.getSelectUsers(1, ev);
    }
    if (path === 'country'){
      this.props.getCountries(1, void 0, void 0, void 0, ev);
    }
    if (path === 'city'){
      this.props.getCities(1, void 0, void 0, void 0, ev);
    }
    _.set(formData, 's', ev);
    this.setState({formData});
  }

  handleSelectFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
    this.props.getPartners(1, formData.name, formData.country, formData.city, formData.user, formData.deliveryPrice,
      formData.membershipPrice, formData.lastMembershipPayment, formData.nextMembershipPayment);
    this.props.history.push('/partners/1');
  }

  handleChangeFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
  }

  handleSearch = () => {
    const {formData} = this.state;
    this.props.getPartners(1, formData.name, formData.country, formData.city, formData.user, formData.deliveryPrice,
      formData.membershipPrice, formData.lastMembershipPayment, formData.nextMembershipPayment);
    this.props.history.push('/partners/1');
  }

  resetAll = () => {
    this.setState({formData: {page: 1}});
    this.props.getPartners(1);
    this.props.history.push(`/partners/${ 1 }`);
  }

  render() {
    const {allPartners, partnersStatus, partnerGetError, allUsers, allCountries, allCities} = this.props;
    const {formData} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <UserHeader title="Partner list"/>
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
                        errors={ partnerGetError.user ? partnerGetError.user.replaceAll('_', ' ') : null }
                      />
                    </label>
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
                              void 0, void 0, void 0,formData.s)
                          }
                        } }
                        onScroll={ () => {
                          if (allCountries?.currentPage < allCountries?.totalPages){
                            this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage + 1 : 1,
                              void 0, void 0, void 0,formData.s)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('country', event) }
                        onChange={ (event) => this.handleSelectFilter('country', event?.value) }
                        value={ formData.country ? formData.country : '' }
                        errors={ partnerGetError.country ? partnerGetError.country.replaceAll('_', ' ') : null }
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
                        errors={ partnerGetError.city ? partnerGetError.city.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <br/>
                    <hr/>
                    <br/>
                    <div className="fLR">
                      <div className="filter__label_row">
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Name" }
                            type={ "text" }
                            value={ formData.name ? formData.name : '' }
                            className="driver__filter_label"
                            errors={ partnerGetError.name ? partnerGetError.name : null }
                            placeholder={ "Name" }
                            title={ formData.name }
                            onChange={ (event) => this.handleChangeFilter('name', event.target.value) }
                          />
                        </label>
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Delivery Price" }
                            type={ "number" }
                            value={ formData.deliveryPrice ? formData.deliveryPrice : '' }
                            className="driver__filter_label"
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ partnerGetError.deliveryPrice ? partnerGetError.deliveryPrice : null }
                            placeholder={ "Delivery Price" }
                            title={ formData.deliveryPrice }
                            onChange={ (event) => this.handleChangeFilter('deliveryPrice', validateInput(event.target.value)) }
                          />
                        </label>
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Last Membership Payment" }
                            type={ "number" }
                            value={ formData.lastMembershipPayment ? formData.lastMembershipPayment : '' }
                            className="driver__filter_label"
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ partnerGetError.lastMembershipPayment ? partnerGetError.lastMembershipPayment : null }
                            placeholder={ "Last Membership Payment" }
                            title={ formData.lastMembershipPayment }
                            onChange={ (event) => this.handleChangeFilter('lastMembershipPayment', validateInput(event.target.value)) }
                          />
                        </label>
                      </div>
                      <div className="filter__label_row">
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Membership Price" }
                            type={ "number" }
                            value={ formData.membershipPrice ? formData.membershipPrice : '' }
                            className="driver__filter_label"
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ partnerGetError.membershipPrice ? partnerGetError.membershipPrice : null }
                            placeholder={ "Membership Price" }
                            title={ formData.membershipPrice }
                            onChange={ (event) => this.handleChangeFilter('membershipPrice', validateInput(event.target.value)) }
                          />
                        </label>
                        <label className="filter__label">
                          <Input
                            size={ 'small' }
                            label={ "Next Membership Payment" }
                            type={ "number" }
                            value={ formData.nextMembershipPayment ? formData.nextMembershipPayment : '' }
                            className="driver__filter_label"
                            inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                            errors={ partnerGetError.nextMembershipPayment ? partnerGetError.nextMembershipPayment : null }
                            placeholder={ "Next Membership Payment" }
                            title={ formData.nextMembershipPayment }
                            onChange={ (event) => this.handleChangeFilter('nextMembershipPayment', validateInput(event.target.value)) }
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
                  </div>
                }
              />
              <Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
                <Button color="inherit" variant="contained">
                  <Autorenew/>
                </Button>
              </Tooltip>
              <Link to='/add_partner'>
                <Button title="Add Service" className="add__user" variant="contained">
                  <FontAwesomeIcon icon={ faHandshake }/>&ensp;Add Partner
                </Button>
              </Link>
            </div>
            { partnersStatus === 'request' ? <p className="center">loading...</p> :
              _.isEmpty(allPartners.array) ? <p className="center">No Partners</p> :
                <PartnerTable data={ allPartners?.array ? allPartners.array : [] }
                              successFunc={ this.props.getPartners }/>
            }
            <br/>
            <br/>
            <div className="center">
              <Pagination
                count={ +allPartners?.totalPages } variant="outlined" page={ +allPartners?.currentPage }
                shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
                onChange={ (event, page) => {
                  this.handleChangeFilter("page", page);
                  this.props.getPartners(page, formData.name, formData.country, formData.city, formData.user, formData.deliveryPrice,
                    formData.membershipPrice, formData.lastMembershipPayment, formData.nextMembershipPayment);
                } }
                renderItem={ (item) => (
                  <PaginationItem
                    type={ "start-ellipsis" }
                    component={ Link }
                    selected
                    to={ `/partners/${ item.page }` }
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
  partnersStatus: state.users.partnersStatus,
  allPartners: state.users.allPartners,
  allUsers: state.users.allUsers,
  allCountries: state.location.allCountries,
  allCities: state.location.allCities,
  partnerGetError: state.users.partnerGetError,
})

const mapDispatchToProps = {
  getPartners,
  getSelectUsers,
  getCountries,
  getCities,
}

const PartnerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Partner)

export default withRouter(PartnerContainer);
