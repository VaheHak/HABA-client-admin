import React, { Component } from 'react';
import _ from "lodash";
import { AddLocation, Close, LocationOn, Shop } from "@material-ui/icons";
import Input from "../../src/components/form/Input";
import Selects from "../../src/components/form/Select";
import { Button } from "@mui/material";
import { connect } from "react-redux";
import moment from "moment";
import Wrapper from "../../src/components/Wrapper";
import ModalButton from "../../src/components/modals/modal";
import { NavLink, withRouter } from "react-router-dom";
import ErrorEnum from "../../src/helpers/ErrorHandler";
import PhoneInput from "../../src/components/form/PhoneInput";
import { deleteDeliveryData, deleteOrder, getDeliveryOrder, updateOrder } from "../store/actions/admin/delivery";
import YMap from "../../src/components/map/ymap";
import Switcher from "../../src/components/form/Switch";
import SearchSelect from "../../src/components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation";
import { getBranches } from "../store/actions/admin/users";
import Results from "../components/utils/Results";
import RouteMap from "../components/map/RouteMap";

class UpdateOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.oId,
			partnerId: this.props.match.params.id,
			formData: {},
			coords: [],
			coords2: [],
			coords3: [],
			payment: [{id: 1, name: "Cash"}, {id: 2, name: "Card"}, {id: 3, name: "Wallet"}],
			status: [{id: 0, name: "Created"}, {id: 1, name: "Pending"}, {id: 2, name: "Took"}, {id: 3, name: "Done"}],
		};
	}

	componentDidMount() {
		const {id, partnerId} = this.state;
		this.props.getDeliveryOrder(id);
		if (partnerId){
			this.props.getBranches(partnerId)
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const id = this.props.match.params.oId;
		const {updateOrder} = this.props;
		if (+prevState.id !== +id){
			this.setState({id});
		}
		if (prevProps.updateOrder !== updateOrder){
			return updateOrder;
		}
	}

	onMapClick = (ev, path) => {
		const {formData} = this.state;
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		_.set(formData, path, coords);
		if (path === 'deliveryCoordinates'){
			this.setState({coords});
		} else if (path === 'senderCoordinates'){
			this.setState({coords2: coords});
		} else{
			this.setState({coords3: coords});
		}
		this.setState({formData});
	}
	handleChangeCoords = (path, ev) => {
		const {coords} = this.state;
		const {order} = this.props;
		if (path === "lat"){
			coords[0] = +ev;
			if (!coords[1]){
				coords[1] = order.deliveryCoordinates && order.deliveryCoordinates[1] ? order.deliveryCoordinates[1] : ''
			}
		}
		if (path === "lon"){
			coords[1] = +ev;
			if (!coords[0]){
				coords[0] = order.deliveryCoordinates && order.deliveryCoordinates[0] ? order.deliveryCoordinates[0] : ''
			}
		}
		this.setState({coords})
	}
	handleChangeCoords2 = (path, ev) => {
		const {coords2} = this.state;
		const {order} = this.props;
		if (path === "lat"){
			coords2[0] = +ev;
			if (!coords2[1]){
				coords2[1] = order.senderCoordinates && order.senderCoordinates[1] ? order.senderCoordinates[1] : ''
			}
		}
		if (path === "lon"){
			coords2[1] = +ev;
			if (!coords2[0]){
				coords2[0] = order.senderCoordinates && order.senderCoordinates[0] ? order.senderCoordinates[0] : ''
			}
		}
		this.setState({coords2})
	}
	handleChangeCoords3 = (path, ev) => {
		const {coords3} = this.state;
		const {order} = this.props;
		if (path === "lat"){
			coords3[0] = +ev;
			if (!coords3[1]){
				coords3[1] = order.storeCoordinates && order.storeCoordinates[1] ? order.storeCoordinates[1] : ''
			}
		}
		if (path === "lon"){
			coords3[1] = +ev;
			if (!coords3[0]){
				coords3[0] = order.storeCoordinates && order.storeCoordinates[0] ? order.storeCoordinates[0] : ''
			}
		}
		this.setState({coords3})
	}
	handleSubmitCoords = (path) => {
		const {formData, coords, coords2, coords3} = this.state;
		_.set(formData, path, path === 'deliveryCoordinates' ? coords : path === 'senderCoordinates' ? coords2 : coords3);
		this.setState({formData, coords: [], coords2: [], coords3: []});
	}

	handleChange = (path, ev) => {
		const {formData} = this.state;
		_.set(formData, path, ev);
		this.setState({formData});
		if (!_.isEmpty(this.props.updateOrderErr)){
			this.props.deleteDeliveryData();
		}
	}

	handleSubmit = (id) => {
		const {formData} = this.state;
		_.set(formData, 'id', id);
		this.setState({formData});
		this.props.updateOrder(formData).then(async (d) => {
			if (d.payload.data.status === true){
				await this.props.getDeliveryOrder(id);
				this.setState({formData: {}, coords: [], coords2: [], coords3: []});
			}
		});
	}

	render() {
		const {updateOrderErr, order, orderStatus, updateStatus, branches} = this.props;
		const {formData, coords, coords2, coords3, payment, status} = this.state;
		const branch = _.find(branches, ['id', +order?.partnerBranchId]);
		const avatar = "/images/icons/avatar.jpg";

		return (<Wrapper showFooter={ false }>
			<div className="container">
				{ orderStatus === "success" && order ? <div className="update__content">
					<div className="user__header">
						<h3 className="users__title">Order Update</h3>
						<div className="partner_info_block">
							<img src={ order?.deliveryServicePartner?.image || avatar } className="partner_image"
							     alt="partner"/>&ensp;
							<div>
								<h4>{ order?.deliveryServicePartner?.name }</h4>
								<h4>{ branch?.address }</h4>
							</div>
						</div>
						<NavLink to={ `/orders` }
						         title="Close"><Close/>
						</NavLink>
					</div>
					<div className="users__filter_area">
                <span className="create__date">
                  <p>Created at { moment(order?.createdAt).format('llll') }</p>
                  <p>Updated at { moment(order?.updatedAt).format('llll') }</p>
                </span>
						<div className="update__buttons_row2">
							<Button title="Buy for me" variant="outlined"
							        onClick={ () => this.handleChange('buyForMe', formData.buyForMe ? !formData.buyForMe : order?.buyForMe && !formData.hasOwnProperty("buyForMe") ? !order.buyForMe : true) }>
								<Shop fontSize="small"/>&ensp;Buy for me
							</Button>
							<ModalButton
								title={ "Delete" }
								label={ "Delete Order" }
								className={ "add__user" }
								cl={ 'log_out' }
								text={ "Are you sure you want to delete this order?" }
								button={ "Delete Order" }
								enter={ "Yes" }
								onClick={ () => this.props.deleteOrder(order?.id).then(() => this.props.history.goBack()) }
							/>
							<Button onClick={ () => this.handleSubmit(order?.id) } variant={ "contained" } title="Save"
							        className={ _.isEmpty(formData) || updateStatus === "request" ? "" : "add__user" }
							        disabled={ _.isEmpty(formData) || updateStatus === "request" }
							>
								{ updateStatus === 'request' ? 'Wait...' : 'Save' }
							</Button>
						</div>
					</div>
					<div className="fLR">
						<div className="filter__label_row">
							<label className='user__update_label2'>
								<p>Status</p><br/>
								<Selects
									size={ "small" }
									df={ 'Choose Status' }
									data={ status }
									className={ formData.status && formData.status !== order?.status ? 'in_border' : null }
									defaultValue={ order?.status }
									title={ formData.status }
									errors={ updateOrderErr.status ? updateOrderErr.status.replaceAll('_', ' ') : null }
									vName={ 'name' }
									keyValue={ 'id' }
									onChange={ (event) => this.handleChange('status', event.target.value) }
								/>
							</label>
							<label className='user__update_label2'>
								<p>Delivery Address</p><br/>
								<Input
									size='small'
									type={ "text" }
									defaultValue={ order?.deliveryAddress || '' }
									className={ `w100 ${ formData.deliveryAddress && formData.deliveryAddress !== order?.deliveryAddress ? 'in_border' : null }` }
									errors={ updateOrderErr.deliveryAddress ? updateOrderErr.deliveryAddress : null }
									placeholder={ "Delivery Address" }
									title={ formData.deliveryAddress }
									onChange={ (event) => this.handleChange('deliveryAddress', event.target.value) }
								/>
							</label>
							<label className='user__update_label2'>
								<p>Delivery Coordinates</p><br/>
								<div
									className={ `dfc w100 ${ formData.deliveryCoordinates && JSON.stringify(formData.deliveryCoordinates) !== JSON.stringify(order?.deliveryCoordinates) ? 'in_border_div' : '' }` }>
									<ModalButton
										title={ "Location" }
										label={ "Location" }
										w={ 'delivery_location_left' }
										className='w100'
										cl={ 'log_out' }
										div={ <div className="delivery_location"><AddLocation/></div> }
										c={ true }
										input={ <div className="user__create_content">
											<div className="update__latLon_row">
												<label className='coords__update_label'>
													<p>Latitude</p><br/>
													<Input
														size={ 'small' }
														value={ coords?.[0] || undefined }
														defaultValue={ coords?.[0] ? undefined : order?.deliveryCoordinates?.[0] }
														onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
														placeholder="Latitude"
														error={ updateOrderErr[`deliveryCoordinates`] ? updateOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
													/>
												</label>&ensp;
												<label className='coords__update_label'>
													<p>Longitude</p><br/>
													<Input
														size={ 'small' }
														value={ coords?.[1] || undefined }
														defaultValue={ coords?.[1] ? undefined : order?.deliveryCoordinates?.[1] }
														onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
														placeholder="Longitude"
														error={ updateOrderErr[`deliveryCoordinates`] ? updateOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
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
											      coords={ !_.isEmpty(formData.deliveryCoordinates) ? formData.deliveryCoordinates : order?.deliveryCoordinates ? order.deliveryCoordinates : [] }
											      state={ !_.isEmpty(formData.deliveryCoordinates) ? formData.deliveryCoordinates : order?.deliveryCoordinates ? order.deliveryCoordinates : [] }
											/>
											<br/>
											<p className="err">
												{ updateOrderErr[`deliveryCoordinates`] ? updateOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
											</p>
										</div> }
									/>
									<div className="delivery_location_middle delivery_location">
										{ formData.deliveryCoordinates ? <p>Lat - { formData.deliveryCoordinates?.[0] }<br/>
											Lon - { formData.deliveryCoordinates?.[1] }</p> : order?.deliveryCoordinates ? <p>
											Lat - { order?.deliveryCoordinates?.[0] }<br/>Lon - { order?.deliveryCoordinates?.[1] }
										</p> : '-' }
									</div>
									<div className="delivery_location_right delivery_location"
									     onClick={ () => this.handleChange('deliveryCoordinates', void 0) }><Close/>
									</div>
								</div>
								<p className="err">
									{ updateOrderErr[`deliveryCoordinates`] ? updateOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
								</p>
							</label>
							<label className='user__update_label2'>
								<p>Customer Name</p><br/>
								<Input
									size={ 'small' }
									type={ "text" }
									defaultValue={ order?.customerName || "" }
									className={ `w100 ${ formData.customerName && formData.customerName !== order?.customerName ? 'in_border' : null }` }
									errors={ updateOrderErr.customerName ? updateOrderErr.customerName : null }
									placeholder={ "Customer Name" }
									title={ formData.customerName }
									onChange={ (event) => this.handleChange('customerName', event.target.value) }
								/>
							</label>
							<label className='user__update_label2'>
								<p>Customer Phone Number</p><br/>
								<PhoneInput
									className={ `w100 ${ formData.customerPhoneNumber && formData.customerPhoneNumber !== order?.customerPhoneNumber ? 'in_border_div' : null }` }
									autoComplete="on"
									defaultValue={ order?.customerPhoneNumber || "" }
									errors={ updateOrderErr.customerPhoneNumber ? ErrorEnum[updateOrderErr.customerPhoneNumber] ? ErrorEnum[updateOrderErr.customerPhoneNumber] : updateOrderErr.customerPhoneNumber : null }
									title={ formData.customerPhoneNumber ? formData.customerPhoneNumber : null }
									onChange={ (event) => this.handleChange('customerPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
								/>
							</label>
							<label className='user__update_label2'>
								<Switcher
									label={ "Is Order For Another" }
									dfChecked={ order?.isOrderForAnother ? order.isOrderForAnother === true : false }
									onChange={ (event) => this.handleChange('isOrderForAnother', event.target.checked) }
								/>
							</label>
							{ formData.isOrderForAnother === 'true' || formData.isOrderForAnother === true || (formData.isOrderForAnother !== false && order?.isOrderForAnother === true) ? <>
								<label className='user__update_label2'>
									<p>Sender Name</p><br/>
									<Input
										size={ 'small' }
										type={ "text" }
										defaultValue={ order?.senderName || '' }
										className={ `w100 ${ formData.senderName && formData.senderName !== order?.senderName ? 'in_border' : null }` }
										errors={ updateOrderErr.senderName ? updateOrderErr.senderName : null }
										placeholder={ "Sender Name" }
										title={ formData.senderName }
										onChange={ (event) => this.handleChange('senderName', event.target.value) }
									/>
								</label>
								<label className='user__update_label2'>
									<p>Sender Phone Number</p><br/>
									<PhoneInput
										className={ `w100 ${ formData.senderPhoneNumber && formData.senderPhoneNumber !== order?.senderPhoneNumber ? 'in_border_div' : null }` }
										autoComplete="on"
										defaultValue={ order?.senderPhoneNumber || "" }
										errors={ updateOrderErr.senderPhoneNumber ? ErrorEnum[updateOrderErr.senderPhoneNumber] ? ErrorEnum[updateOrderErr.senderPhoneNumber] : updateOrderErr.senderPhoneNumber : null }
										title={ formData.senderPhoneNumber ? formData.senderPhoneNumber : null }
										onChange={ (event) => this.handleChange('senderPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
									/>
								</label>
								<label className='user__update_label2'>
									<p>Sender Address</p><br/>
									<Input
										size='small'
										type={ "text" }
										defaultValue={ order?.senderAddress || '' }
										className={ `w100 ${ formData.senderAddress && formData.senderAddress !== order?.senderAddress ? 'in_border' : null }` }
										errors={ updateOrderErr.senderAddress ? updateOrderErr.senderAddress : null }
										placeholder={ "Sender Address" }
										title={ formData.senderAddress }
										onChange={ (event) => this.handleChange('senderAddress', event.target.value) }
									/>
								</label>
								<label className='user__update_label2'>
									<p>Sender Coordinates</p><br/>
									<div
										className={ `dfc w100 ${ formData.senderCoordinates && JSON.stringify(formData.senderCoordinates) !== JSON.stringify(order?.senderCoordinates) ? 'in_border_div' : null }` }>
										<ModalButton
											title={ "Location" }
											label={ "Location" }
											className="w100"
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
															value={ coords2?.[0] || undefined }
															defaultValue={ coords2?.[0] ? undefined : order?.senderCoordinates?.[0] }
															onChange={ (ev) => this.handleChangeCoords2('lat', ev.target.value) }
															placeholder="Latitude"
															error={ updateOrderErr[`senderCoordinates`] ? updateOrderErr[`senderCoordinates`].replaceAll('_', ' ') : null }
														/>
													</label>&ensp;
													<label className='coords__update_label'>
														<p>Longitude</p><br/>
														<Input
															size={ 'small' }
															value={ coords2?.[1] || undefined }
															defaultValue={ coords2?.[1] ? undefined : order?.senderCoordinates?.[1] }
															onChange={ (ev) => this.handleChangeCoords2('lon', ev.target.value) }
															placeholder="Longitude"
															error={ updateOrderErr[`senderCoordinates`] ? updateOrderErr[`senderCoordinates`].replaceAll('_', ' ') : null }
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
												      coords={ !_.isEmpty(formData.senderCoordinates) ? formData.senderCoordinates : order?.senderCoordinates ? order.senderCoordinates : [] }
												      state={ !_.isEmpty(formData.senderCoordinates) ? formData.senderCoordinates : order?.senderCoordinates ? order.senderCoordinates : [] }
												/>
												<br/>
												<p className="err">
													{ updateOrderErr[`deliveryCoordinates`] ? updateOrderErr[`deliveryCoordinates`].replaceAll('_', ' ') : null }
												</p>
											</div> }
										/>
										<div className="delivery_location_middle delivery_location">
											{ formData.senderCoordinates ? <p>Lat - { formData.senderCoordinates?.[0] }<br/>
												Lon - { formData.senderCoordinates?.[1] }</p> : order?.senderCoordinates ? <p>
												Lat - { order?.senderCoordinates?.[0] }<br/>Lon - { order?.senderCoordinates?.[1] }</p> : '-' }
										</div>
										<div className="delivery_location_right delivery_location"
										     onClick={ () => this.handleChange('senderCoordinates', void 0) }><Close/>
										</div>
									</div>
									<p className="err">
										{ updateOrderErr[`senderCoordinates`] ? updateOrderErr[`senderCoordinates`].replaceAll('_', ' ') : null }
									</p>
								</label>
							</> : null }
							<label className='user__update_label2'>
								<p>Driver</p><br/>
								<SearchSelect
									data={ [{
										value: "", label: '- Choose Driver -'
									}, ..._.map(branch?.driverPartnerBranches || [], (v) => ({
										value: v.id,
										label: `${ v.id }) ${ v.driverUser.firstName || 'No firstname' } ${ v.driverUser.lastName || 'No lastname' } | ${ v.driverUser.phoneNumber || 'No phone' } | ${ v.driverUser.username || 'No username' }`,
									}))] }
									name="Drivers"
									value={ order?.deliveryServiceDriver?.driverUser ? {
										value: order?.driverId,
										label: `${ order?.driverId }) ${ order?.deliveryServiceDriver?.driverUser?.firstName || 'No firstname' } ${ order?.deliveryServiceDriver?.driverUser?.lastName || 'No lastname' } | ${ order?.deliveryServiceDriver?.driverUser?.phoneNumber || 'No phone' } | ${ order?.deliveryServiceDriver?.driverUser?.username || 'No username' }`,
									} : '' }
									onChange={ (event) => this.handleChange('driver', event?.value) }
									errors={ updateOrderErr.driver ? updateOrderErr.driver.replaceAll('_', ' ') : null }
								/>
							</label>
							<label className='user__update_label2'>
								<p>Order Price</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									defaultValue={ order?.orderPrice || "" }
									className={ `w100 ${ formData.orderPrice && formData.orderPrice !== order?.orderPrice ? 'in_border' : null }` }
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ updateOrderErr.orderPrice ? updateOrderErr.orderPrice : null }
									placeholder={ "Price" }
									title={ formData.orderPrice }
									onChange={ (event) => this.handleChange('orderPrice', validateInput(event.target.value)) }
								/>
							</label>
							<label className='user__update_label2'>
								<p>Payment Method</p><br/>
								<Selects
									size={ "small" }
									df={ 'Choose Payment Method' }
									data={ payment }
									className={ `w100 ${ formData.paymentMethod && formData.paymentMethod !== order?.paymentMethod ? 'in_border' : null }` }
									defaultValue={ order?.paymentMethod }
									title={ formData.paymentMethod }
									errors={ updateOrderErr.paymentMethod ? updateOrderErr.paymentMethod.replaceAll('_', ' ') : null }
									vName={ 'name' }
									keyValue={ 'id' }
									onChange={ (event) => this.handleChange('paymentMethod', event.target.value) }
								/>
							</label>
							<label className='user__update_label2'>
								<p>Delivery Price</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									defaultValue={ order?.deliveryPrice || "" }
									className={ `w100 ${ formData.deliveryPrice && formData.deliveryPrice !== order?.deliveryPrice ? 'in_border' : null }` }
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ updateOrderErr.deliveryPrice ? updateOrderErr.deliveryPrice : null }
									placeholder={ "Price" }
									title={ formData.deliveryPrice }
									onChange={ (event) => this.handleChange('deliveryPrice', validateInput(event.target.value)) }
								/>
							</label>
							{ order?.route ? <label className='user__update_label2'>
								<p>Intermediate Route</p><br/>
								<div className="dfc w100">
									<ModalButton
										title={ "Add Route" }
										label={ "Add Route" }
										className={ 'w100' }
										w={ 'delivery_location_left' }
										cl={ 'log_out' }
										div={ <div className="delivery_location"><LocationOn/></div> }
										c={ true }
										input={ <div className="user__create_content">
											<RouteMap coordinates={ order?.route }/>
											<br/>
											<p className="err">
												{ updateOrderErr[`route`] ? updateOrderErr[`route`].replaceAll('_', ' ') : null }
											</p>
										</div> }
									/>
									<div className="delivery_location_middle delivery_location">
										{ order?.route ? <p>A - { order?.route?.[0]?.join(' - ') }<br/>
											B - { order?.route?.[1].join(' - ') }</p> : '-' }
									</div>
									<div className="delivery_location_right delivery_location"/>
								</div>
								<p className="err">
									{ updateOrderErr[`route`] ? updateOrderErr[`route`].replaceAll('_', ' ') : null }
								</p>
							</label> : null }
						</div>
						<div className="filter__label_row">
							{ formData.buyForMe === 'true' || formData.buyForMe === true || (formData.buyForMe !== false && order?.buyForMe === true) ?
								<div className="buyForMe_section update">
									<div className="buyForMe_title"><h3>Go to shop</h3>&ensp;<Shop/></div>
									<br/>
									<label className='delivery_add_label'>
										<h4>&ensp;Store Address</h4><br/>
										<Input
											size='small'
											type={ "text" }
											sx={ {background: 'white', borderRadius: '4px'} }
											defaultValue={ order?.storeAddress || "" }
											className={ `w100 ${ formData.storeAddress && formData.storeAddress !== order?.storeAddress ? 'in_border' : null }` }
											errors={ updateOrderErr.storeAddress ? updateOrderErr.storeAddress : null }
											placeholder={ "Store Address" }
											title={ formData.storeAddress }
											onChange={ (event) => this.handleChange('storeAddress', event.target.value) }
										/>
									</label>
									<label className='delivery_add_label'>
										<h4>&ensp;Store Coordinates</h4><br/>
										<div
											className={ `dfc w100 ${ formData.storeCoordinates && JSON.stringify(formData.storeCoordinates) !== JSON.stringify(order?.storeCoordinates) ? 'in_border_div' : null }` }>
											<ModalButton
												title={ "Location" }
												label={ "Location" }
												className="w100"
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
																value={ coords3?.[0] || undefined }
																defaultValue={ coords3?.[0] ? undefined : order?.storeCoordinates?.[0] }
																onChange={ (ev) => this.handleChangeCoords3('lat', ev.target.value) }
																placeholder="Latitude"
																errors={ updateOrderErr[`storeCoordinates`] ? updateOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
															/>
														</label>&ensp;
														<label className='coords__update_label'>
															<p>Longitude</p><br/>
															<Input
																size={ 'small' }
																value={ coords3?.[1] || undefined }
																defaultValue={ coords3?.[1] ? undefined : order?.storeCoordinates?.[1] }
																onChange={ (ev) => this.handleChangeCoords3('lon', ev.target.value) }
																placeholder="Longitude"
																errors={ updateOrderErr[`storeCoordinates`] ? updateOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
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
													      coords={ !_.isEmpty(formData.storeCoordinates) ? formData.storeCoordinates : order?.storeCoordinates ? order.storeCoordinates : [] }
													      state={ !_.isEmpty(formData.storeCoordinates) ? formData.storeCoordinates : order?.storeCoordinates ? order.storeCoordinates : [] }
													/>
													<br/>
													<p className="err">
														{ updateOrderErr[`storeCoordinates`] ? updateOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
													</p>
												</div> }
											/>
											<div className="delivery_location_middle delivery_location">
												{ formData.storeCoordinates ? <p>Lat - { formData.storeCoordinates?.[0] }<br/>
													Lon - { formData.storeCoordinates?.[1] }</p> : order?.storeCoordinates ? <p>
													Lat - { order?.storeCoordinates?.[0] }<br/>Lon - { order?.storeCoordinates?.[1] }</p> : '-' }
											</div>
											<div className="delivery_location_right delivery_location"
											     onClick={ () => this.handleChange('storeCoordinates', void 0) }><Close/>
											</div>
										</div>
										<p className="err">
											{ updateOrderErr[`storeCoordinates`] ? updateOrderErr[`storeCoordinates`].replaceAll('_', ' ') : null }
										</p>
									</label>
									<label className='delivery_add_label'>
										<h4>&ensp;Description</h4><br/>
										<Input
											size='small'
											type={ "text" }
											sx={ {background: 'white', borderRadius: '4px'} }
											defaultValue={ order?.description }
											className={ `w100 ${ formData.description && formData.description !== order?.description ? 'in_border' : null }` }
											multiline
											minRows={ 3 }
											maxRows={ 7 }
											errors={ updateOrderErr.description ? updateOrderErr.description : null }
											placeholder={ "What to buy ?" }
											title={ formData.description }
											onChange={ (event) => this.handleChange('description', event.target.value) }
										/>
									</label>
								</div> : null }
						</div>
					</div>
				</div> : <><br/><p className="center">{ orderStatus === "request" ? 'loading...' : 'No such order' }</p></> }
			</div>
			<Results/>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	order: state.delivery.order,
	orderStatus: state.delivery.orderStatus,
	updateOrder: state.delivery.updateOrder,
	updateStatus: state.delivery.updateStatus,
	updateOrderErr: state.delivery.updateOrderErr,
	branches: state.users.branches,
})

const mapDispatchToProps = {
	getBranches, getDeliveryOrder, deleteOrder, updateOrder, deleteDeliveryData,
}

const UpdateOrderContainer = connect(mapStateToProps, mapDispatchToProps,)(UpdateOrder)

export default withRouter(UpdateOrderContainer);
