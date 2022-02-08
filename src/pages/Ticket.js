import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import '../assets/css/pages/ticket.css'
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";
import { Autorenew, FilterList, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { getTickets } from "../store/actions/admin/service";
import Results from "../components/utils/Results";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import Input from "../components/form/Input";
import TicketTable from "../components/tables/ticketTable";
import Selects from "../components/form/Select";
import UserHeader from "../components/UserHeader";
import SearchSelect from "../components/form/SelectSearch";
import { getSelectUsers } from "../store/actions/admin/users";

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        page: 1,
      },
      status: [{id: 1, name: "Pending"}, {id: 2, name: "Start"}, {id: 3, name: "Cancel"}, {id: 4, name: "End"}],
      s: '',
    };
  }

  componentDidMount() {
    const {page} = this.props.match.params;
    this.props.getTickets(page ? page : 1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.ticketCreate !== this.props.ticketCreate){
      return this.props.ticketCreate;
    }
  }

  handleSearchSelect = (path, ev) => {
    if (path === 's'){
      this.props.getSelectUsers(1, ev);
    }
    this.setState({s: ev});
  }

  handleSelectFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
    this.props.getTickets(1, formData.id, formData.toStartDate, formData.fromStartDate, formData.status, formData.user);
    this.props.history.push('/ticket/1');
  }

  handleChangeFilter = (path, event) => {
    const {formData} = this.state;
    _.set(formData, path, event);
    this.setState({formData});
  }

  handleSearch = () => {
    const {formData} = this.state;
    this.props.getTickets(1, formData.id, formData.toStartDate, formData.fromStartDate, formData.status, formData.user);
    this.props.history.push('/ticket/1');
  }

  resetAll = () => {
    this.setState({formData: {page: 1}});
    this.props.getTickets(1);
    this.props.history.push(`/ticket/${ 1 }`);
  }

  render() {
    const {allTickets, ticketStatus, ticketGetErr, allUsers} = this.props;
    const {formData, status, s} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <UserHeader title="Ticket list"/>
        <div className="container">
          <div className="users__content">
            <div className="users__filter_area">
              <ModalButton
                title={ "Filter" }
                label={ "Filter" }
                button={ <FilterList/> }
                input={
                  <div className="users__filter_row">
                    <div className="dfc">
                      <label className="filter__label_row">
                        <Input
                          size={ 'small' }
                          label={ "Id" }
                          type={ "number" }
                          value={ formData.id ? formData.id : '' }
                          className="driver__filter_label"
                          inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
                          errors={ ticketGetErr.id ? ticketGetErr.id : null }
                          placeholder={ "Id" }
                          title={ formData.id }
                          autoComplete="on"
                          onChange={ (event) => this.handleChangeFilter('id', event.target.value) }
                        />
                      </label>
                      <div className="filter_button filter__label_row" onClick={ () => this.handleSearch() }>
                        <Button color="primary" variant="contained" style={ {padding: '8px 16px'} }>
                          <Search fontSize="small"/>
                          Search
                        </Button>
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
                    <div className="fLR">
                      <label className="filter__label_row">
                        <h5>&ensp;Status</h5><br/>
                        <Selects
                          size={ "small" }
                          df={ 'Choose Status' }
                          data={ status }
                          value={ formData.status }
                          title={ formData.status }
                          errors={ ticketGetErr.status ? ticketGetErr.status.replaceAll('_', ' ') : null }
                          vName={ 'name' }
                          keyValue={ 'id' }
                          onChange={ (event) => this.handleSelectFilter('status', event.target.value) }
                        />
                      </label>
                      <label className="filter__label_row">
                        <h5>&ensp;User</h5><br/>
                        <SearchSelect
                          data={ [{value: "", label: '- Choose User -'}, ..._.map(allUsers?.array || [], (v) => ({
                            value: v.id,
                            label: `${ v.id }) ${ v.username || 'No username' }`,
                          }))] }
                          name="User"
                          onFocus={ () => this.props.getSelectUsers(1) }
                          onScrollTop={ () => {
                            if (allUsers?.currentPage > 1){
                              this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage - 1 : 1, s)
                            }
                          } }
                          onScroll={ () => {
                            if (allUsers?.currentPage < allUsers?.totalPages){
                              this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage + 1 : 1, s)
                            }
                          } }
                          onInputChange={ (event) => this.handleSearchSelect('s', event) }
                          onChange={ (event) => this.handleSelectFilter('user', event?.value) }
                          value={ formData.user ? formData.user : '' }
                          errors={ ticketGetErr.user ? ticketGetErr.user.replaceAll('_', ' ') : null }
                        />
                      </label>
                    </div>
                  </div>
                }
              />
              <Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
                <Button color="inherit" variant="contained">
                  <Autorenew/>
                </Button>
              </Tooltip>
              <Link to='/add_ticket'>
                <Button title="Add Ticket" className="add__user" variant="contained">
                  <FontAwesomeIcon icon={ faTicketAlt }/>&ensp;Add Ticket
                </Button>
              </Link>
            </div>
            { ticketStatus === 'request' ? <p className="center">loading...</p> :
              _.isEmpty(allTickets.array) ? <p className="center">No Tickets</p> :
                <TicketTable data={ allTickets.array } successFunc={ this.props.getTickets }/>
            }
            <br/>
            <br/>
            <div className="center">
              <Pagination
                count={ +allTickets?.totalPages } variant="outlined" page={ +allTickets?.currentPage }
                shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
                onChange={ (event, page) => {
                  this.props.getTickets(page, formData.id, formData.toStartDate, formData.fromStartDate, formData.status, formData.user);
                } }
                renderItem={ (item) => (
                  <PaginationItem
                    type={ "start-ellipsis" }
                    component={ Link }
                    selected
                    to={ `/ticket/${ item.page }` }
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
  ticketStatus: state.service.ticketStatus,
  allTickets: state.service.allTickets,
  allUsers: state.users.allUsers,
  ticketGetErr: state.service.ticketGetErr,
})

const mapDispatchToProps = {
  getTickets,
  getSelectUsers,
}

const TicketContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ticket)

export default withRouter(TicketContainer);
