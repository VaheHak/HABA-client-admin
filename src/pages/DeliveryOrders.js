import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/delivery.css'
import { Link, withRouter } from "react-router-dom";
import { Autorenew, FilterList, Search } from "@material-ui/icons";
import { getDeliveryOrders } from "../store/actions/admin/delivery";
import { connect } from "react-redux";
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";
import ModalButton from "../../src/components/modals/modal";
import DeliveryTable from "../../src/components/tables/deliveryTable";
import Input from "../../src/components/form/Input";
import Selects from "../../src/components/form/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import Results from "../components/utils/Results";
import SearchSelect from "../components/form/SelectSearch";
import { getBranches, getPartners } from "../store/actions/admin/users";

class DeliveryOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
			status: [{id: 0, name: "Created"}, {id: 1, name: "Pending"},
				{id: 2, name: "Took"}, {id: 3, name: "Done"}],
			partner: ''
		}
	}

	componentDidMount() {
		const s = new URLSearchParams(this.props.location.search);
		this.props.getDeliveryOrders(void 0, void 0, s.get('page') ? s.get('page') : 1);
	}

	handleSearchSelect = (path, ev) => {
		if (path === 'partner'){
			this.props.getPartners(1, ev);
			this.setState({partner: ev});
		}
		if (path === 'branchId' && ev && isFinite(ev)){
			this.props.getBranches(ev);
		}
	}

	handleSelectFilter = (path, event) => {
		const {formData} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
		this.props.getDeliveryOrders(formData?.partner, formData?.branchId, 1, formData.endDate, formData.startDate,
			formData.address, formData.status);
	}

	handleChange = (path, event) => {
		const {formData} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
	}

	handleSearch = () => {
		const {formData} = this.state;
		this.props.getDeliveryOrders(formData?.partner, formData?.branchId, 1, formData.endDate, formData.startDate,
			formData.address, formData.status);
	}

	resetAll = () => {
		this.setState({formData: {}});
		this.props.getDeliveryOrders(void 0, void 0, 1)
		this.props.history.push(`?page=${ 1 }`);
	}

	render() {
		const {orders, orderStatus, ordersErr, allPartners, branches} = this.props;
		const {formData, status, partner} = this.state;

		return (
			<Wrapper showFooter={ false }>
				<UserHeader title="Delivery Orders"/>
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
											<label className="filter__label_row">
												<h5>&ensp;From Created Date</h5><br/>
												<input type="datetime-local"
												       value={ formData.startDate }
												       className="delivery_date_input"
												       onChange={ (event) => this.handleSelectFilter('startDate', event.target.value) }/>
											</label>
											<label className="filter__label_row">
												<h5>&ensp;To Created Date</h5><br/>
												<input type="datetime-local"
												       value={ formData.endDate }
												       className="delivery_date_input"
												       onChange={ (event) => this.handleSelectFilter('endDate', event.target.value) }/>
											</label>
										</div>
										<br/>
										<br/>
										<div className="fLR">
											<label className="filter__label_row2">
												<Input
													size={ 'small' }
													label={ "Delivery Address" }
													type={ "text" }
													value={ formData.address ? formData.address : '' }
													className="w100"
													errors={ ordersErr.address ? ordersErr.address : null }
													placeholder={ "Address" }
													title={ formData.address }
													onChange={ (event) => this.handleChange('address', event.target.value) }
												/>
											</label>
											<div className="filter__button2" onClick={ () => this.handleSearch() }>
												<Button color="primary" variant="contained" style={ {padding: '8px 16px'} }>
													<Search fontSize="small"/>
													Search
												</Button>
											</div>
										</div>
										<br/>
										<label className="w100">
											<h5>&ensp;Status</h5><br/>
											<Selects
												size={ "small" }
												df={ 'Choose Status' }
												data={ status }
												value={ formData.status }
												title={ formData.status }
												errors={ ordersErr.status ? ordersErr.status.replaceAll('_', ' ') : null }
												vName={ 'name' }
												keyValue={ 'id' }
												onChange={ (event) => this.handleSelectFilter('status', event.target.value) }
											/>
										</label>
										<br/><br/>
										<label className="w100">
											<h5>Partner</h5><br/>
											<SearchSelect
												data={ [{value: '', label: '- Choose Partner -'}, ..._.map(allPartners?.array || [], (v) => ({
													value: v.id,
													label: `${ v.id }) ${ v.name || 'No name' }`,
												}))] }
												name="Partner"
												onFocus={ () => this.props.getPartners(1) }
												onScrollTop={ () => {
													if (allPartners?.currentPage > 1){
														this.props.getPartners(allPartners?.currentPage ? allPartners?.currentPage - 1 : 1, partner)
													}
												} }
												onScroll={ () => {
													if (allPartners?.currentPage < allPartners?.totalPages){
														this.props.getPartners(allPartners?.currentPage ? allPartners?.currentPage + 1 : 1, partner)
													}
												} }
												onInputChange={ (event) => this.handleSearchSelect('partner', event) }
												onChange={ (event) => this.handleSelectFilter('partner', event?.value) }
											/>
										</label>
										<br/>
										{ formData?.partner ? <label className="w100">
											<h5>Partner Branch</h5><br/>
											<SearchSelect
												data={ [{value: '', label: '- Choose Branch -'}, ..._.map(branches || [], (v) => ({
													value: v.id,
													label: `${ v.id }) ${ v.address || 'No address' }`,
												}))] }
												name="Branch"
												onFocus={ () => formData?.partner ? this.props.getBranches(formData?.partner) : null }
												onInputChange={ (event) => this.handleSearchSelect('branchId', event) }
												onChange={ (event) => this.handleSelectFilter('branchId', event?.value) }
											/>
										</label> : null }
									</div>
								}
							/>
							<h4>Orders - { orders?.totalItems ? orders?.totalItems : 0 }</h4>
							<Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
								<Button color="inherit" variant="contained">
									<Autorenew/>
								</Button>
							</Tooltip>
							<Tooltip title="Add Delivery Service" arrow>
								<Button color="inherit" variant="contained" className="add__user"
								        onClick={ () => this.props.history.push(`/add_order`) }>
									<FontAwesomeIcon icon={ faNotesMedical }/>&ensp;Add Order
								</Button>
							</Tooltip>
						</div>
						{ orderStatus === 'request' ? <p className="center">Loading...</p> :
							_.isEmpty(orders.array) ? <p className="center">No Orders</p> :
								<DeliveryTable data={ orders.array ? orders.array : [] } onClick={ this.props.getDeliveryOrders }
								               formData={ formData }/> }
						<br/>
						<br/>
						<div className="center">
							<Pagination
								count={ +orders?.totalPages || 1 } variant="outlined" page={ +orders?.currentPage || 1 }
								shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
								onChange={ (event, page) => {
									this.props.getDeliveryOrders(formData?.partner, formData?.branchId, page, formData.endDate,
										formData.startDate, formData.address, formData.status);
									this.handleChange('page', page);
								} }
								renderItem={ (item) => (
									<PaginationItem
										type={ "start-ellipsis" }
										component={ Link }
										selected
										to={ `?page=${ item.page }` }
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
	orders: state.delivery.orders,
	ordersErr: state.delivery.ordersErr,
	orderStatus: state.delivery.orderStatus,
	allPartners: state.users.allPartners,
	branches: state.users.branches,
})

const mapDispatchToProps = {
	getDeliveryOrders,
	getPartners,
	getBranches,
}

const DeliveryOrdersContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(DeliveryOrders)

export default withRouter(DeliveryOrdersContainer);
