import React, { Component } from 'react';
import _ from "lodash";
import { connect } from "react-redux";
import Wrapper from "../../src/components/Wrapper";
import Input from "../../src/components/form/Input";
import { createOrder } from "../store/actions/admin/delivery";
import { Button } from "@mui/material";
import UserHeader from "../../src/components/UserHeader";
import PhoneInput from "../../src/components/form/PhoneInput";
import ErrorEnum from "../../src/helpers/ErrorHandler";
import ModalButton from "../../src/components/modals/modal";
import YMap from "../../src/components/map/ymap";
import { validateInput } from "../helpers/InputValidation";
import SearchSelect from "../../src/components/form/SelectSearch";
import Switcher from "../../src/components/form/Switch";
import Selects from "../../src/components/form/Select";
import { AddLocation, Close, Shop } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import { getBranches, getPartners } from "../store/actions/admin/users";
import Results from "../components/utils/Results";
import RouteMap from "../components/map/RouteMap";

class AddOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createFormData: {},
			coords: [],
			coords2: [],
			coords3: [],
			payment: [{id: 1, name: "Cash"}, {id: 2, name: "Card"}, {id: 3, name: "Wallet"}],
			partner: '',
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.createFormData !== this.state.createFormData){
			return this.state.createFormData;
		}
		if (prevProps.createOrder !== this.props.createOrder){
			return this.props.createOrder;
		}
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

	onMapClick = (ev, path) => {
		const {createFormData} = this.state;
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		_.set(createFormData, path, coords);
		if (path === 'deliveryCoordinates'){
			this.setState({coords});
		} else if (path === 'senderCoordinates'){
			this.setState({coords2: coords});
		} else{
			this.setState({coords3: coords});
		}
		this.setState({createFormData});
	}
	handleChangeCoords = (path, ev) => {
		const {coords} = this.state;
		if (path === "lat"){
			coords[0] = +ev;
		}
		if (path === "lon"){
			coords[1] = +ev;
		}
		this.setState({coords})
	}
	handleChangeCoords2 = (path, ev) => {
		const {coords2} = this.state;
		if (path === "lat"){
			coords2[0] = +ev;
		}
		if (path === "lon"){
			coords2[1] = +ev;
		}
		this.setState({coords2})
	}
	handleChangeCoords3 = (path, ev) => {
		const {coords3} = this.state;
		if (path === "lat"){
			coords3[0] = +ev;
		}
		if (path === "lon"){
			coords3[1] = +ev;
		}
		this.setState({coords3})
	}
	handleSubmitCoords = (path) => {
		const {createFormData, coords, coords2, coords3} = this.state;
		_.set(createFormData, path, path === 'deliveryCoordinates' ? coords : path === 'senderCoordinates' ? coords2 : coords3);
		this.setState({createFormData, coords: [], coords2: [], coords3: []});
	}

	handleChange = (path, ev) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, ev);
		this.setState({createFormData})
	}
	handleSubmit = () => {
		const {createFormData} = this.state;
		this.setState({createFormData});
		this.props.createOrder(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.setState({createFormData: {}, coords: [], coords2: [], coords3: []});
			}
		})
	}

	render() {
		const {createOrderErr, createStatus, allPartners, branches} = this.props;
		const {createFormData, coords, coords2, coords3, payment, partner} = this.state;
		const branch = createFormData?.partnerBranchId ? _.find(branches, ['id', +createFormData?.partnerBranchId]) : null;
		const p = createFormData?.partner ? _.find(allPartners?.array, ['id', +createFormData?.partner]) : null;

		return (<Wrapper showFooter={ false }>
			<UserHeader title="Add Order"/>
			<div className="container">
				<div className="add__content2">
					<div className="delivery_add_container">
						<div className="delivery_add_content">
							<label className="delivery_add_label">
								<h4>Partner</h4><br/>
								<SearchSelect
									data={ [{value: '', label: '- Choose Partner -'}, ..._.map(allPartners?.array || [], (v) => ({
										value: v.id, label: `${ v.id }) ${ v.name || 'No name' }`,
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
									errors={ createOrderErr.partner ? createOrderErr.partner.replaceAll('_', ' ') : null }
									onInputChange={ (event) => this.handleSearchSelect('partner', event) }
									onChange={ (event) => this.handleChange('partner', event?.value) }
								/>
							</label>
							<br/>
							{ createFormData?.partner ? <label className="delivery_add_label">
								<h4>Partner Branch</h4><br/>
								<SearchSelect
									data={ [{value: '', label: '- Choose Branch -'}, ..._.map(branches || [], (v) => ({
										value: v.id, label: `${ v.id }) ${ v.address || 'No address' }`,
									}))] }
									name="Branch"
									errors={ createOrderErr.partnerBranchId ? createOrderErr.partnerBranchId.replaceAll('_', ' ') : null }
									onFocus={ () => createFormData?.partner ? this.props.getBranches(createFormData?.partner) : null }
									onInputChange={ (event) => this.handleSearchSelect('branchId', event) }
									onChange={ (event) => this.handleChange('partnerBranchId', event?.value) }
								/>
							</label> : null }
							<label className='delivery_add_label'>
								<p>Delivery Address</p><br/>
								<Input
									size='small'
									type={ "text" }
									value={ createFormData.deliveryAddress ? createFormData.deliveryAddress : '' }
									className="w100"
									errors={ createOrderErr.deliveryAddress ? createOrderErr.deliveryAddress : null }
									placeholder={ "Delivery Address" }
									title={ createFormData.deliveryAddress }
									onChange={ (event) => this.handleChange('deliveryAddress', event.target.value) }
								/>
							</label>
							<label className='delivery_add_label'>
								<p>Delivery Coordinates</p><br/>
								<div className="dfc w100">
									<ModalButton
										title={ "Add Location" }
										label={ "Add Location" }
										className={ 'w100' }
										w={ 'delivery_location_left' }
										cl={ 'log_out' }
										div={ <div className="delivery_location"><AddLocation/></div> }
										c={ true }
										input={ <div className="user__create_content">
											<div className="update__latLon_row">
												<label className='coords__update_label'>
													<p>Latitude</p><br/>
													<Input
														size={ 'small' }
														value={ coords && coords[0] ? coords[0] : '' }
														onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
														placeholder="Latitude"
														errors={ createOrderErr[`deliveryCoordinates`] ? createOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
													/>
												</label>&ensp;
												<label className='coords__update_label'>
													<p>Longitude</p><br/>
													<Input
														size={ 'small' }
														value={ coords && coords[1] ? coords[1] : '' }
														onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
														placeholder="Longitude"
														errors={ createOrderErr[`deliveryCoordinates`] ? createOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
													/>
												</label>&ensp;
												<div className='coords__update_label'>
													<Button onClick={ () => this.handleSubmitCoords('deliveryCoordinates') }
													        className={ "add__user" }
													        variant="contained" title="Save">
														Save
													</Button>
												</div>
											</div>
											<YMap onClick={ (ev) => this.onMapClick(ev, 'deliveryCoordinates') }
											      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), "deliveryCoordinates") }
											      coords={ !_.isEmpty(createFormData.deliveryCoordinates) ? createFormData.deliveryCoordinates : [] }
											      state={ !_.isEmpty(createFormData.deliveryCoordinates) ? createFormData.deliveryCoordinates : [] }
											/>
											<br/>
											<p className="err">
												{ createOrderErr[`deliveryCoordinates`] ? createOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
											</p>
										</div> }
									/>
									<div className="delivery_location_middle delivery_location">
										{ createFormData.deliveryCoordinates ? <p>Lat - { createFormData.deliveryCoordinates?.[0] }<br/>
											Lon - { createFormData.deliveryCoordinates?.[1] }</p> : '-' }
									</div>
									<div className="delivery_location_right delivery_location"
									     onClick={ () => this.handleChange('deliveryCoordinates', void 0) }><Close/>
									</div>
								</div>
								<p className="err">
									{ createOrderErr[`deliveryCoordinates`] ? createOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
								</p>
							</label>
							<label className='delivery_add_label'>
								<p>Customer Name</p><br/>
								<Input
									size={ 'small' }
									type={ "text" }
									value={ createFormData.customerName ? createFormData.customerName : "" }
									className="w100"
									errors={ createOrderErr.customerName ? createOrderErr.customerName : null }
									placeholder={ "Customer Name" }
									title={ createFormData.customerName }
									onChange={ (event) => this.handleChange('customerName', event.target.value) }
								/>
							</label>
							<label className='delivery_add_label'>
								<p>Customer Phone Number</p><br/>
								<PhoneInput
									className="w100"
									autoComplete="on"
									value={ createFormData.customerPhoneNumber ? createFormData.customerPhoneNumber : "" }
									errors={ createOrderErr.customerPhoneNumber ? ErrorEnum[createOrderErr.customerPhoneNumber] ? ErrorEnum[createOrderErr.customerPhoneNumber] : createOrderErr.customerPhoneNumber : null }
									title={ createFormData.customerPhoneNumber ? createFormData.customerPhoneNumber : null }
									onChange={ (event) => this.handleChange('customerPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
								/>
							</label>
							<label className='delivery_add_label'>
								<Switcher
									label={ "Is Order For Another" }
									checked={ createFormData.isOrderForAnother ? createFormData.isOrderForAnother === 'true' || createFormData.isOrderForAnother === true : false }
									onChange={ (event) => this.handleChange('isOrderForAnother', event.target.checked) }
								/>
							</label>
							{ createFormData.isOrderForAnother === 'true' || createFormData.isOrderForAnother === true ? <>
								<label className='delivery_add_label'>
									<p>Sender Name</p><br/>
									<Input
										size={ 'small' }
										type={ "text" }
										value={ createFormData.senderName }
										className="w100"
										errors={ createOrderErr.senderName ? createOrderErr.senderName : null }
										placeholder={ "Sender Name" }
										title={ createFormData.senderName }
										onChange={ (event) => this.handleChange('senderName', event.target.value) }
									/>
								</label>
								<label className='delivery_add_label'>
									<p>Sender Phone Number</p><br/>
									<PhoneInput
										className="w100"
										autoComplete="on"
										value={ createFormData.senderPhoneNumber ? createFormData.senderPhoneNumber : "" }
										errors={ createOrderErr.senderPhoneNumber ? ErrorEnum[createOrderErr.senderPhoneNumber] ? ErrorEnum[createOrderErr.senderPhoneNumber] : createOrderErr.senderPhoneNumber : null }
										title={ createFormData.senderPhoneNumber ? createFormData.senderPhoneNumber : null }
										onChange={ (event) => this.handleChange('senderPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
									/>
								</label>
								<label className='delivery_add_label'>
									<p>Sender Address</p><br/>
									<Input
										size='small'
										type={ "text" }
										value={ createFormData.senderAddress ? createFormData.senderAddress : '' }
										className="w100"
										errors={ createOrderErr.senderAddress ? createOrderErr.senderAddress : null }
										placeholder={ "Sender Address" }
										title={ createFormData.senderAddress }
										onChange={ (event) => this.handleChange('senderAddress', event.target.value) }
									/>
								</label>
								<label className='delivery_add_label'>
									<p>Sender Coordinates</p><br/>
									<div className="dfc w100">
										<ModalButton
											title={ "Add Location" }
											label={ "Add Location" }
											className={ 'w100' }
											w={ 'delivery_location_left' }
											cl={ 'log_out' }
											div={ <div className="delivery_location"><AddLocation/></div> }
											c={ true }
											input={ <div className="user__create_content">
												<div className="update__latLon_row">
													<label className='coords__update_label'>
														<p>Latitude</p><br/>
														<Input
															size={ 'small' }
															value={ coords2 && coords2[0] ? coords2[0] : '' }
															onChange={ (ev) => this.handleChangeCoords2('lat', ev.target.value) }
															placeholder="Latitude"
															errors={ createOrderErr[`senderCoordinates`] ? createOrderErr[`senderCoordinates`].replaceAll('_', ' ') : null }
														/>
													</label>&ensp;
													<label className='coords__update_label'>
														<p>Longitude</p><br/>
														<Input
															size={ 'small' }
															value={ coords2 && coords2[1] ? coords2[1] : '' }
															onChange={ (ev) => this.handleChangeCoords2('lon', ev.target.value) }
															placeholder="Longitude"
															errors={ createOrderErr[`senderCoordinates`] ? createOrderErr[`senderCoordinates`].replaceAll('_', ' ') : null }
														/>
													</label>&ensp;
													<div className='coords__update_label'>
														<Button onClick={ () => this.handleSubmitCoords('senderCoordinates') }
														        className={ "add__user" }
														        variant="contained" title="Save">
															Save
														</Button>
													</div>
												</div>
												<YMap onClick={ (ev) => this.onMapClick(ev, 'senderCoordinates') }
												      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), "senderCoordinates") }
												      coords={ !_.isEmpty(createFormData.senderCoordinates) ? createFormData.senderCoordinates : [] }
												      state={ !_.isEmpty(createFormData.senderCoordinates) ? createFormData.senderCoordinates : [] }
												/>
												<br/>
												<p className="err">
													{ createOrderErr[`deliveryCoordinates`] ? createOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
												</p>
											</div> }
										/>
										<div className="delivery_location_middle delivery_location">
											{ createFormData.senderCoordinates ? <p>Lat - { createFormData.senderCoordinates?.[0] }<br/>
												Lon - { createFormData.senderCoordinates?.[1] }</p> : '-' }
										</div>
										<div className="delivery_location_right delivery_location"
										     onClick={ () => this.handleChange('senderCoordinates', void 0) }><Close/>
										</div>
									</div>
									<p className="err">
										{ createOrderErr[`senderCoordinates`] ? createOrderErr[`senderCoordinates`].replaceAll('_', ' ') : null }
									</p>
								</label>
							</> : null }
							{ createFormData?.partnerBranchId ? <label className='delivery_add_label'>
								<p>Driver</p><br/>
								<SearchSelect
									data={ [{
										value: "", label: '- Choose Driver -'
									}, ..._.map(branch?.driverPartnerBranches || [], (v) => ({
										value: v.id,
										label: `${ v.id }) ${ v.driverUser.firstName || 'No firstname' } ${ v.driverUser.lastName || 'No lastname' } | ${ v.driverUser.phoneNumber || 'No phone' } | ${ v.driverUser.username || 'No username' }`,
									}))] }
									name="Drivers"
									onChange={ (event) => this.handleChange('driver', event?.value) }
									errors={ createOrderErr.driver ? createOrderErr.driver.replaceAll('_', ' ') : null }
								/>
							</label> : null }
							<label className='delivery_add_label'>
								<p>Order Price</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									value={ createFormData.orderPrice ? createFormData.orderPrice : "" }
									className="w100"
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ createOrderErr.orderPrice ? createOrderErr.orderPrice : null }
									placeholder={ "Price" }
									title={ createFormData.orderPrice }
									onChange={ (event) => this.handleChange('orderPrice', validateInput(event.target.value)) }
								/>
							</label>
							<label className='delivery_add_label'>
								<p>Payment Method</p><br/>
								<Selects
									size={ "small" }
									df={ 'Choose Payment Method' }
									data={ payment }
									value={ createFormData.paymentMethod ? createFormData.paymentMethod : "" }
									title={ createFormData.paymentMethod }
									errors={ createOrderErr.paymentMethod ? createOrderErr.paymentMethod.replaceAll('_', ' ') : null }
									vName={ 'name' }
									keyValue={ 'id' }
									onChange={ (event) => this.handleChange('paymentMethod', event.target.value) }
								/>
							</label>
							{ createFormData?.partner && p?.routes ? <label className='delivery_add_label'>
								<p>Intermediate Route</p><br/>
								<h3>&ensp;Price - { p?.routePrice }</h3><br/>
								<div className="dfc w100">
									<ModalButton
										title={ "Add Route" }
										label={ "Add Route" }
										className={ 'w100' }
										w={ 'delivery_location_left' }
										cl={ 'log_out' }
										div={ <div className="delivery_location"><AddLocation/></div> }
										onClick={ () => this.handleChange('route', p?.routes) }
										enter={ "Add" }
										input={ <div className="user__create_content">
											<RouteMap coordinates={ p?.routes }/>
											<br/>
											<p className="err">
												{ createOrderErr[`route`] ? createOrderErr[`route`].replaceAll('_', ' ') : null }
											</p>
										</div> }
									/>
									<div className="delivery_location_middle delivery_location">
										{ createFormData.route ? <p>A - { createFormData.route?.[0]?.join(' - ') }<br/>
											B - { createFormData.route?.[1].join(' - ') }</p> : '-' }
									</div>
									<div className="delivery_location_right delivery_location"
									     onClick={ () => this.handleChange('route', void 0) }><Close/>
									</div>
								</div>
								<p className="err">
									{ createOrderErr[`route`] ? createOrderErr[`route`].replaceAll('_', ' ') : null }
								</p>
							</label> : null }
						</div>
						<div className="delivery_right_section">
							<div className="add__buttons_row">
								<Button title="Buy for me" variant="outlined"
								        onClick={ () => this.handleChange('buyForMe', createFormData.buyForMe ? !createFormData.buyForMe : true) }>
									<Shop fontSize="small"/>&ensp;Buy for me
								</Button>
								<Button title="Cancel" className="add__user" variant="contained"
								        onClick={ () => {
									        this.setState({createFormData: {}, coords: [], coords2: [], coords3: []});
									        this.props.history.goBack();
								        } }>
									Cancel
								</Button>
								<Button onClick={ this.handleSubmit } className={ createStatus === 'request' ? "" : "add__user" }
								        disabled={ createStatus === 'request' }
								        variant="contained" title="Save">
									{ createStatus === 'request' ? 'Wait...' : 'Submit' }
								</Button>
							</div>
							{ createFormData.buyForMe === 'true' || createFormData.buyForMe === true ?
								<div className="buyForMe_section">
									<div className="buyForMe_title"><h3>Go to shop</h3>&ensp;<Shop/></div>
									<br/>
									<label className='delivery_add_label'>
										<h4>Store Address</h4><br/>
										<Input
											size='small'
											type={ "text" }
											sx={ {background: 'white', borderRadius: '4px'} }
											value={ createFormData.storeAddress ? createFormData.storeAddress : '' }
											className="w100"
											errors={ createOrderErr.storeAddress ? createOrderErr.storeAddress : null }
											placeholder={ "Store Address" }
											title={ createFormData.storeAddress }
											onChange={ (event) => this.handleChange('storeAddress', event.target.value) }
										/>
									</label>
									<label className='delivery_add_label'>
										<h4>Store Coordinates</h4><br/>
										<div className="dfc w100">
											<ModalButton
												title={ "Add Location" }
												label={ "Add Location" }
												className={ 'w100' }
												cl={ 'log_out' }
												w={ 'delivery_location_left' }
												div={ <div className="delivery_location"><AddLocation/></div> }
												c={ true }
												input={ <div className="user__create_content">
													<div className="update__latLon_row">
														<label className='coords__update_label'>
															<p>Latitude</p><br/>
															<Input
																size={ 'small' }
																value={ coords3 && coords3[0] ? coords3[0] : '' }
																onChange={ (ev) => this.handleChangeCoords3('lat', ev.target.value) }
																placeholder="Latitude"
																errors={ createOrderErr[`storeCoordinates`] ? createOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
															/>
														</label>&ensp;
														<label className='coords__update_label'>
															<p>Longitude</p><br/>
															<Input
																size={ 'small' }
																value={ coords3 && coords3[1] ? coords3[1] : '' }
																onChange={ (ev) => this.handleChangeCoords3('lon', ev.target.value) }
																placeholder="Longitude"
																errors={ createOrderErr[`storeCoordinates`] ? createOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
															/>
														</label>&ensp;
														<div className='coords__update_label'>
															<Button onClick={ () => this.handleSubmitCoords('storeCoordinates') }
															        className={ "add__user" }
															        variant="contained" title="Save">
																Save
															</Button>
														</div>
													</div>
													<YMap onClick={ (ev) => this.onMapClick(ev, 'storeCoordinates') }
													      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), "storeCoordinates") }
													      coords={ !_.isEmpty(createFormData.storeCoordinates) ? createFormData.storeCoordinates : [] }
													      state={ !_.isEmpty(createFormData.storeCoordinates) ? createFormData.storeCoordinates : [] }
													/>
													<br/>
													<p className="err">
														{ createOrderErr[`storeCoordinates`] ? createOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
													</p>
												</div> }
											/>
											<div className="delivery_location_middle delivery_location">
												{ createFormData.storeCoordinates ? <p>Lat - { createFormData.storeCoordinates?.[0] }<br/>
													Lon - { createFormData.storeCoordinates?.[1] }</p> : '-' }
											</div>
											<div className="delivery_location_right delivery_location"
											     onClick={ () => this.handleChange('storeCoordinates', void 0) }><Close/>
											</div>
										</div>
										<p className="err">
											{ createOrderErr[`storeCoordinates`] ? createOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
										</p>
									</label>
									<label className='delivery_add_label'>
										<h4>Description</h4><br/>
										<Input
											size='small'
											type={ "text" }
											sx={ {background: 'white', borderRadius: '4px'} }
											value={ createFormData.description ? createFormData.description : '' }
											className="w100"
											multiline
											minRows={ 3 }
											maxRows={ 7 }
											errors={ createOrderErr.description ? createOrderErr.description : null }
											placeholder={ "What to buy ?" }
											title={ createFormData.description }
											onChange={ (event) => this.handleChange('description', event.target.value) }
										/>
									</label>
								</div> : null }
						</div>
					</div>
				</div>
			</div>
			<Results/>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	createOrder: state.delivery.createOrder,
	createOrderErr: state.delivery.createOrderErr,
	createStatus: state.delivery.createStatus,
	allPartners: state.users.allPartners,
	branches: state.users.branches,
})

const mapDispatchToProps = {
	createOrder, getPartners, getBranches,
}

const AddOrderContainer = connect(mapStateToProps, mapDispatchToProps,)(AddOrder)

export default withRouter(AddOrderContainer);
