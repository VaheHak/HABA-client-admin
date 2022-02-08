import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";
import { Autorenew, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { createRoute, getCities, getRoutes } from "../store/actions/admin/location";
import Results from "../components/utils/Results";
import RouteTable from "../components/tables/routeTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRoute } from "@fortawesome/free-solid-svg-icons";
import UserHeader from "../components/UserHeader";
import SearchSelect from "../components/form/SelectSearch";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createFormData: {},
    };
  }

  componentDidMount() {
    const {page} = this.props.match.params;
    this.props.getRoutes(page ? page : 1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.routeCreate !== this.props.routeCreate){
      return this.props.routeCreate;
    }
  }

  handleSearchSelect = (path, ev) => {
    if (path === 's'){
      this.props.getCities(1, void 0, void 0, void 0, ev);
    }
  }

  handleSelectFilter = (page, sk, s) => {
    this.props.getRoutes(page, sk, s)
  }

  handleChange = (path, value) => {
    const {createFormData} = this.state;
    _.set(createFormData, path, _.trim(value));
    this.setState({createFormData});
  };

  handleSubmit = () => {
    const {createFormData} = this.state;
    this.props.createRoute(createFormData).then((d) => {
      if (d.payload.data.status === true){
        this.props.getRoutes();
        this.setState({createFormData: {}});
      }
    })
  }

  resetAll = () => {
    this.setState({createFormData: {}, coords: []});
    this.props.getRoutes(1)
    this.props.history.push(`/route/${ 1 }`);
  }

  render() {
    const {allRoutes, routesStatus, routeCreateErr, allCities, location, myAccount, routeCreateStatus} = this.props;
    const {createFormData} = this.state;
    const s = new URLSearchParams(location.search);

    return (
      <Wrapper showFooter={ false }>
        <UserHeader title="Route list"/>
        <div className="container">
          <div className="users__content">
            <div className="users__filter_area">
              <div className="search_input">
                <Search fontSize="small" className="search_icon"/>
                <input type="search" placeholder='Search'/>
              </div>
              <Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
                <Button color="inherit" variant="contained">
                  <Autorenew/>
                </Button>
              </Tooltip>
              { +myAccount?.role === 1 ? <ModalButton
                title={ "Add Route" }
                label={ "Add Route" }
                button={ <><FontAwesomeIcon icon={ faRoute }/>&ensp;Add Route</> }
                enter={ routeCreateStatus === 'request' ? "Wait..." : "Submit" }
                className={ "add__user" }
                cl={ 'log_out' }
                c={ true }
                onClick={ () => routeCreateStatus === 'request' ? null : this.handleSubmit() }
                input={
                  <div className="user__create_content">
                    <label className="user__create_label">
                      <p>From</p><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose City -'}, ..._.map(allCities.array, (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.name || 'No name' }`,
                        }))] }
                        required={ true }
                        name="City"
                        onFocus={ () => this.props.getCities(1) }
                        onScrollTop={ () => {
                          if (allCities?.currentPage > 1){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage - 1 : 1)
                          }
                        } }
                        onScroll={ () => {
                          if (allCities?.currentPage < allCities?.totalPages){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage + 1 : 1)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('s', event) }
                        onChange={ (event) => this.handleChange('from', event?.value) }
                        value={ createFormData.from ? createFormData.from : '' }
                        errors={ routeCreateErr.from ? routeCreateErr.from.replaceAll('_', ' ') : null }
                      />
                    </label>
                    <label className="user__create_label">
                      <p>To</p><br/>
                      <SearchSelect
                        data={ [{value: '', label: '- Choose City -'}, ..._.map(allCities.array, (v) => ({
                          value: v.id,
                          label: `${ v.id }) ${ v.name || 'No name' }`,
                        }))] }
                        required={ true }
                        name="City"
                        onFocus={ () => this.props.getCities(1) }
                        onScrollTop={ () => {
                          if (allCities?.currentPage > 1){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage - 1 : 1)
                          }
                        } }
                        onScroll={ () => {
                          if (allCities?.currentPage < allCities?.totalPages){
                            this.props.getCities(allCities?.currentPage ? allCities?.currentPage + 1 : 1)
                          }
                        } }
                        onInputChange={ (event) => this.handleSearchSelect('s', event) }
                        onChange={ (event) => this.handleChange('to', event?.value) }
                        value={ createFormData.to ? createFormData.to : '' }
                        errors={ routeCreateErr.to ? routeCreateErr.to.replaceAll('_', ' ') : null }
                      />
                    </label>
                  </div>
                }
              /> : null }
            </div>
            { routesStatus === 'request' ? <p className="center">loading...</p> :
              _.isEmpty(allRoutes.array) ? <p className="center">No Routes</p> :
                <RouteTable data={ allRoutes.array } onClick={ this.props.getRoutes }/>
            }
            <br/>
            <br/>
            <div className="center">
              <Pagination
                count={ +allRoutes?.totalPages || 1 } variant="outlined" page={ +allRoutes?.currentPage || 1 }
                shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
                onChange={ (event, page) => {
                  this.handleSelectFilter(page, s.get('sk') || void 0, s.get('sort') || void 0);
                } }
                renderItem={ (item) => (
                  <PaginationItem
                    type={ "start-ellipsis" }
                    component={ Link }
                    selected
                    to={ `/route/${ item.page }?sk=${ s.get('sk') }&sort=${ s.get('sort') }` }
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
  routesStatus: state.location.routesStatus,
  allRoutes: state.location.allRoutes,
  allCities: state.location.allCities,
  routeCreate: state.location.routeCreate,
  routeCreateErr: state.location.routeCreateErr,
  routeCreateStatus: state.location.routeCreateStatus,
})

const mapDispatchToProps = {
  getRoutes,
  getCities,
  createRoute,
}

const RoutesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Routes)

export default withRouter(RoutesContainer);
