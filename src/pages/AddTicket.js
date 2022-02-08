import React, { Component } from 'react';
import _ from "lodash";
import { Close } from "@material-ui/icons";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import Input from "../components/form/Input";
import InputRadio from "../components/form/Radio";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createTicket, getService, getServices, getTickets } from "../store/actions/admin/service";
import Selects from "../components/form/Select";
import Switcher from "../components/form/Switch";
import ModalButton from "../components/modals/modal";
import YMap from "../components/map/ymap";
import PhoneInput from "../components/form/PhoneInput";
import ErrorEnum from "../helpers/ErrorHandler";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation";
import { Button } from "@mui/material";
import { getSelectUsers } from "../store/actions/admin/users";

class AddTicket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createFormData: {},
			detailsFormData: {},
			openDetails: false,
			coords: [],
			coords2: [],
			interFormData: [],
			s: '',
		};
	}

	componentDidMount() {
		this.props.getTickets(1);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.createFormData !== this.state.createFormData){
			return this.state.createFormData;
		}
		if (prevProps.ticketCreate !== this.props.ticketCreate){
			return this.props.ticketCreate;
		}
	}

	handleSearchSelect = (path, ev) => {
		if (path === 's'){
			this.props.getSelectUsers(1, ev);
		}
		if (path === 'service'){
			this.props.getServices(1, ev, void 0, void 0, 1);
		}
		this.setState({s: ev});
	}

	handleChange = (path, ev) => {
		const {createFormData} = this.state;
		if (path === 'service'){
			if (ev){
				this.props.getService(ev)
			}
		}
		_.set(createFormData, path, _.trim(ev));
		this.setState({createFormData})
	}

	handleSubmit = () => {
		const {createFormData} = this.state;
		this.props.createTicket(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.setState({
					createFormData: {}, detailsFormData: {}, interFormData: [],
					coords: [], coords2: [], openDetails: false
				});
			}
		})
	}

	handleChangeDetails = (path, ev) => {
		const {detailsFormData, createFormData} = this.state;
		const {service} = this.props;
		if (path === 'kg'){
			if (!_.isEmpty(service)){
				const details = _.find(service.details, ['type', '2']);
				if (+ev <= +details?.availableCount){
					_.set(detailsFormData, path, _.trim(ev));
				}
			}
		} else{
			_.set(detailsFormData, path, _.trim(ev));
		}
		const details = [];
		if (!_.isEmpty(detailsFormData)){
			details.push(detailsFormData);
		}
		_.set(createFormData, "details", details);
		this.setState({detailsFormData, createFormData})
	}

	handleClose = () => {
		this.setState((state) => {
			return {
				openDetails: false, detailsFormData: {},
				createFormData: {...state.createFormData, details: void 0}
			}
		});
	}

	onMapClick = (ev, path, k) => {
		const {createFormData, detailsFormData, interFormData} = this.state;
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		if (+createFormData.serviceType === 1){
			_.set(interFormData[k], path, coords);
			if (path === 'toCity'){
				this.setState({coords2: coords});
			} else{
				this.setState({coords});
			}
			_.set(createFormData, "details", interFormData);
			this.setState({interFormData, createFormData});
		}
		if (+createFormData.serviceType === 2){
			_.set(detailsFormData, path, coords);
			if (path === 'toCity'){
				this.setState({coords2: coords});
			} else{
				this.setState({coords});
			}
			const details = [];
			if (!_.isEmpty(detailsFormData)){
				details.push(detailsFormData);
			}
			_.set(createFormData, "details", details);
			this.setState({detailsFormData, createFormData})
		}
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

	handleSubmitCoords = (path, k) => {
		const {createFormData, detailsFormData, interFormData, coords, coords2} = this.state;
		if (+createFormData.serviceType === 1){
			_.set(interFormData[k], path, path === 'toCity' ? coords2 : coords);
			_.set(createFormData, "details", interFormData);
			this.setState({interFormData})
		}
		if (+createFormData.serviceType === 2){
			_.set(detailsFormData, path, path === 'toCity' ? coords2 : coords);
			const details = [];
			if (!_.isEmpty(detailsFormData)){
				details.push(detailsFormData);
			}
			_.set(createFormData, "details", details);
			this.setState({detailsFormData});
		}
		this.setState({createFormData, coords2: [], coords: []});
	}

	addDetail = () => {
		const {createFormData, interFormData} = this.state;
		const {service} = this.props;
		if (+createFormData.serviceType === 1){
			if (!_.isEmpty(service)){
				const details = _.find(service.details, ['type', '1']);
				if (+interFormData.length < +details?.availableCount){
					const x = _.findLast(interFormData, (n) => (n));
					const seat = x?.passengerSeat ? +x.passengerSeat + 1 : 1;
					const y = _.find(interFormData, ['passengerSeat', seat.toString()]);
					interFormData.push({passengerSeat: seat <= +details?.availableCount && !y ? seat : ''});
				}
			}
			this.setState({interFormData})
		}
		if (+createFormData.serviceType === 2){
			this.setState({openDetails: true})
		}
	}

	handleCloseInter = (i) => {
		const {interFormData, createFormData} = this.state;
		interFormData.splice(i, 1);
		this.setState({
			interFormData,
			createFormData: {...createFormData, details: _.isEmpty(interFormData) ? void 0 : interFormData},
		});
	}

	handleChangeIntercity = (path, ev, k) => {
		const {interFormData, createFormData} = this.state;
		const {service} = this.props;
		if (path === 'passengerSeat'){
			const detail = _.find(service.details, ['type', '1']);
			const y = _.find(interFormData, ['passengerSeat', ev]);
			if (+ev <= +detail?.availableCount && !y){
				_.set(interFormData[k], path, ev);
			}
		} else{
			_.set(interFormData[k], path, ev);
		}
		_.set(createFormData, "details", interFormData);
		this.setState({interFormData, createFormData})
	}

	render() {
		const {ticketCreateErr, allUsers, service, allServices, ticketCreateStatus} = this.props;
		const {createFormData, detailsFormData, interFormData, openDetails, coords, coords2, s} = this.state;
		const userPhone = _.find(allUsers?.array, ['id', +createFormData.user]);

		return (
			<Wrapper showFooter={ false }>
				<div className="container">
					<div className="add__content">
						<div className="user__header">
							<h3 className="users__title">Add Ticket</h3>
							<NavLink to={ '/ticket' } title="Close"><Close/></NavLink>
						</div>
						<div className="country__filter_area">
							<div className="country__update_content">
								<label className='country__update_label'>
									<p>Service</p><br/>
									<SearchSelect
										data={ [{value: "", label: '- Choose Service -'}, ..._.map(allServices?.array || [], (v) => ({
											value: v.id,
											label: `${ v.id })`,
										}))] }
										name="Service"
										onFocus={ () => this.props.getServices(1, void 0, void 0, void 0, 1) }
										onScrollTop={ () => {
											if (allServices?.currentPage > 1){
												this.props.getServices(allServices?.currentPage ? allServices?.currentPage - 1 : 1, s, void 0, void 0, 1)
											}
										} }
										onScroll={ () => {
											if (allServices?.currentPage < allServices?.totalPages){
												this.props.getServices(allServices?.currentPage ? allServices?.currentPage + 1 : 1, s, void 0, void 0, 1)
											}
										} }
										onInputChange={ (event) => this.handleSearchSelect('service', validateInput(event)) }
										onChange={ (event) => this.handleChange('service', validateInput(event?.value)) }
										value={ createFormData.service ? createFormData.service : '' }
										errors={ ticketCreateErr.service ? ticketCreateErr.service : null }
									/>
									<p className="err">
										{ createFormData.service && _.isEmpty(service) ? 'No such service' : null }
									</p>
								</label>
								{ service?.details ? <label className='country__update_label'>
									<p>Service Type</p><br/>
									<Selects
										size={ "small" }
										df={ 'Choose Type' }
										className="service__details_input"
										data={ service?.details?.length === 2 ? [{id: 1, name: 'Inercity T'}, {id: 2, name: 'Cargo T'}] :
											+service?.details?.[0]?.type === 1 ? [{id: 1, name: 'Inercity T'}] : [{id: 2, name: 'Cargo T'}] }
										value={ createFormData.serviceType ? createFormData.serviceType : '' }
										errors={ ticketCreateErr.serviceType ? ticketCreateErr.serviceType : null }
										vName={ 'name' }
										keyValue={ 'id' }
										onChange={ (event) => this.handleChange('serviceType', event.target.value) }
									/>
								</label> : null }
								<label className='country__update_label'>
									<p>User</p><br/>
									<SearchSelect
										data={ [{value: "", label: '- Choose User -'}, ..._.map(allUsers?.array || [], (v) => ({
											value: v.id,
											label: `${ v.id }) ${ v.firstName || 'No firstname' } ${ v.lastName
											|| 'No lastname' } | ${ v.phoneNumber || 'No phone' } | ${ v.username || 'No username' }`,
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
										onChange={ (event) => this.handleChange('user', event?.value) }
										value={ createFormData.user ? createFormData.user : '' }
										errors={ ticketCreateErr.user ? ticketCreateErr.user.replaceAll('_', ' ') : null }
									/>
								</label>
								<div className="dfa">Add Ticket Details &ensp;
									<FontAwesomeIcon
										icon={ faPlusSquare } className="add__service_button"
										onClick={ () => this.addDetail() }
									/>
								</div>
								<br/>
								{ +createFormData.serviceType === 1 ?
									<div className='dfj add__ticket_details'>{
										_.map(interFormData, (v, k) => (
											v ? <div className="ticket_details intercity_details" key={ k }>
                          <span className="close_details" title="Remove details"
                                onClick={ () => this.handleCloseInter(k) }><Close/></span>
												<div className="country__update_label">
													<InputRadio
														label={ 'State' }
														data={ [{value: 1, name: "Pending"}, {value: 2, name: "Start"},
															{value: 3, name: "Cancel"}, {value: 4, name: "End"}] }
														value={ v?.state ? +v.state : 1 }
														onChange={ (event) => this.handleChangeIntercity('state', event.target.value, k) }
													/>
													<p className="err">
														{ ticketCreateErr[`details.${ k }.state`] ? ticketCreateErr[`details.${ k }.state`] : null }
													</p>
												</div>
												<div className='country__update_label'>
													<p>Location (from)</p><br/>
													<ModalButton
														title={ "Doubleclick to add location" }
														label={ "Add Location" }
														className={ 'w100' }
														db={ true }
														div={ <div className="center ticket_location">{ v.fromAddress ? v.fromAddress + ', ' : '-' }
															{ v.fromCity ? v.fromCity?.[0] + ' - ' + v.fromCity[1] : ", -" }</div> }
														c={ true }
														input={
															<div className="user__create_content">
																<label className='country__update_label'>
																	<h4>Address (from)</h4><br/>
																	<Input
																		size={ 'small' }
																		type={ "text" }
																		value={ v.fromAddress ? v.fromAddress : '' }
																		className="driver__filter_label"
																		errors={ ticketCreateErr.fromAddress ? ticketCreateErr.fromAddress :
																			ticketCreateErr[`details.${ k }.fromAddress`] ? ticketCreateErr[`details.${ k }.fromAddress`] : null }
																		placeholder={ "Address (from)" }
																		title={ v.fromAddress }
																		onChange={ (event) => this.handleChangeIntercity('fromAddress', event.target.value, k) }
																	/>
																</label>
																<h4>City (from)</h4>
																<br/>
																<div className="update__latLon_row">
																	<label className='coords__update_label'>
																		<p>Latitude</p><br/>
																		<Input
																			size={ 'small' }
																			value={ coords && coords[0] ? coords[0] : '' }
																			onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
																			placeholder="Latitude"
																			error={ ticketCreateErr[`details.${ k }.fromCity`] ? ticketCreateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<label className='coords__update_label'>
																		<p>Longitude</p><br/>
																		<Input
																			size={ 'small' }
																			value={ coords && coords[1] ? coords[1] : '' }
																			onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
																			placeholder="Longitude"
																			error={ ticketCreateErr[`details.${ k }.fromCity`] ? ticketCreateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<div className='coords__update_label'>
																		<Button onClick={ () => this.handleSubmitCoords('fromCity', k) }
																		        className={ "add__user" }
																		        variant="contained" title="Save">
																			Save
																		</Button>
																	</div>
																</div>
																<YMap onClick={ (ev) => this.onMapClick(ev, 'fromCity', k) }
																      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), 'fromCity', k) }
																      coords={ !_.isEmpty(v.fromCity) ? v.fromCity : [] }
																      state={ !_.isEmpty(v.fromCity) ? v.fromCity : [] }
																/>
																<br/>
																<p className="err">
																	{ ticketCreateErr[`details.${ k }.fromCity`] ? ticketCreateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
																</p>
															</div>
														}
													/>
													<br/>
													<p className="err center">{ ticketCreateErr.fromAddress ? ticketCreateErr.fromAddress :
														ticketCreateErr[`details.${ k }.fromAddress`] ? ticketCreateErr[`details.${ k }.fromAddress`] : null }</p>
													<br/>
													<p className="err center">
														{ ticketCreateErr[`details.${ k }.fromCity`] ? ticketCreateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
													</p>
												</div>
												<div className='country__update_label'>
													<p>Location (to)</p><br/>
													<ModalButton
														title={ "Doubleclick to add location" }
														label={ "Add Location" }
														className={ 'w100' }
														db={ true }
														div={ <div className="center ticket_location">{ v.toAddress ? v.toAddress + ', ' : '-' }
															{ v.toCity ? v.toCity?.[0] + ' - ' + v.toCity[1] : ", -"
															}</div> }
														c={ true }
														input={
															<div className="user__create_content">
																<label className='country__update_label'>
																	<h4>Address (to)</h4><br/>
																	<Input
																		size={ 'small' }
																		type={ "text" }
																		value={ v.toAddress ? v.toAddress : '' }
																		className="driver__filter_label"
																		errors={ ticketCreateErr.toAddress ? ticketCreateErr.toAddress :
																			ticketCreateErr[`details.${ k }.toAddress`] ? ticketCreateErr[`details.${ k }.toAddress`] : null }
																		placeholder={ "Address (to)" }
																		title={ v.toAddress }
																		onChange={ (event) => this.handleChangeIntercity('toAddress', event.target.value, k) }
																	/>
																</label>
																<h4>City (to)</h4>
																<br/>
																<div className="update__latLon_row">
																	<label className='coords__update_label'>
																		<p>Latitude</p><br/>
																		<Input
																			size={ 'small' }
																			value={ coords2 && coords2[0] ? coords2[0] : '' }
																			onChange={ (ev) => this.handleChangeCoords2('lat', ev.target.value) }
																			placeholder="Latitude"
																			error={ ticketCreateErr[`details.${ k }.toCity`] ? ticketCreateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<label className='coords__update_label'>
																		<p>Longitude</p><br/>
																		<Input
																			size={ 'small' }
																			value={ coords2 && coords2[1] ? coords2[1] : '' }
																			onChange={ (ev) => this.handleChangeCoords2('lon', ev.target.value) }
																			placeholder="Longitude"
																			error={ ticketCreateErr[`details.${ k }.toCity`] ? ticketCreateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<div className='coords__update_label'>
																		<Button onClick={ () => this.handleSubmitCoords('toCity', k) }
																		        className={ "add__user" }
																		        variant="contained" title="Save">
																			Save
																		</Button>
																	</div>
																</div>
																<YMap onClick={ (ev) => this.onMapClick(ev, 'toCity', k) }
																      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), 'toCity', k) }
																      coords={ !_.isEmpty(v.toCity) ? v.toCity : [] }
																      state={ !_.isEmpty(v.toCity) ? v.toCity : [] }
																/>
																<br/>
																<p className="err">
																	{ ticketCreateErr[`details.${ k }.toCity`] ? ticketCreateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
																</p>
															</div>
														}
													/>
													<br/>
													<p className="err center">{ ticketCreateErr.toAddress ? ticketCreateErr.toAddress :
														ticketCreateErr[`details.${ k }.toAddress`] ? ticketCreateErr[`details.${ k }.toAddress`] : null }</p>
													<br/>
													<p className="err center">
														{ ticketCreateErr[`details.${ k }.toCity`] ? ticketCreateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
													</p>
												</div>
												<hr/>
												<br/>
												<label className="country__update_label">
													<p>Passenger Phone Number</p><br/>
													<PhoneInput
														className="ticket_input"
														value={ v.passengerPhoneNumber ? v.passengerPhoneNumber : '' }
														errors={ ticketCreateErr.passengerPhoneNumber ? ErrorEnum[ticketCreateErr.passengerPhoneNumber]
																? ErrorEnum[ticketCreateErr.passengerPhoneNumber] : ticketCreateErr.passengerPhoneNumber.replaceAll('_', ' ') :
															ticketCreateErr[`details.${ k }.passengerPhoneNumber`] ? ticketCreateErr[`details.${ k }.passengerPhoneNumber`] : null }
														title={ v.passengerPhoneNumber }
														onChange={ (event) => this.handleChangeIntercity('passengerPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event, k) }
													/>
													{ _.isEmpty(v.passengerPhoneNumber) && userPhone?.phoneNumber ? <div
														className="recommended_number"
														onClick={ () => this.handleChangeIntercity('passengerPhoneNumber', userPhone?.phoneNumber, k) }>
														{ userPhone?.phoneNumber }
													</div> : null }
												</label>
												<div className='dfc'>
													<label className='ticket__update_label'>
														<p>Passengers Seat</p><br/>
														<Input
															size={ 'small' }
															type={ "number" }
															value={ v.passengerSeat ? v.passengerSeat : '' }
															className="driver__filter_label ticket_input"
															inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
															errors={ ticketCreateErr.passengerSeat ? ticketCreateErr.passengerSeat :
																ticketCreateErr[`details.${ k }.passengerSeat`] ? ticketCreateErr[`details.${ k }.passengerSeat`] : null }
															placeholder={ "Passengers Seat" }
															title={ v.passengerSeat }
															onChange={ (event) => this.handleChangeIntercity('passengerSeat', validateInput(event.target.value), k) }
														/>
													</label>
													<label className='ticket__update_label'>
														<Switcher
															label={ "Children Seat" }
															checked={ v.isChildPassenger ? v.isChildPassenger === 'true' || v.isChildPassenger === true : false }
															onChange={ (event) => this.handleChangeIntercity('isChildPassenger', event.target.checked, k) }
														/>
													</label>
												</div>
												<br/>
											</div> : null
										))
									}</div> :
									openDetails ? <div className="ticket_details">
											<span className="close_details" onClick={ this.handleClose }><Close/></span>
											<div className="country__update_label">
												<InputRadio
													label={ 'State' }
													data={ [{value: 1, name: "Pending"}, {value: 2, name: "Start"},
														{value: 3, name: "Cancel"}, {value: 4, name: "End"}] }
													value={ detailsFormData.state ? +detailsFormData.state : 1 }
													onChange={ (event) => this.handleChangeDetails('state', event.target.value) }
												/>
												<p className="err">
													{ ticketCreateErr['details.0.state'] ? ticketCreateErr['details.0.state'] : null }
												</p>
											</div>
											<div className='country__update_label'>
												<p>Location (from)</p><br/>
												<ModalButton
													title={ "Doubleclick to add location" }
													label={ "Add Location" }
													className={ 'w100' }
													db={ true }
													div={ <div
														className="center ticket_location">{ detailsFormData.fromAddress ? detailsFormData.fromAddress + ', ' : '-' }
														{ detailsFormData.fromCity ? detailsFormData.fromCity?.[0] + ' - ' + detailsFormData.fromCity?.[1] : ", -" }
													</div> }
													c={ true }
													input={
														<div className="user__create_content">
															<label className='country__update_label'>
																<h4>Address (from)</h4><br/>
																<Input
																	size={ 'small' }
																	type={ "text" }
																	value={ detailsFormData.fromAddress ? detailsFormData.fromAddress : '' }
																	className="driver__filter_label"
																	errors={ ticketCreateErr.fromAddress ? ticketCreateErr.fromAddress :
																		ticketCreateErr['details.0.fromAddress'] ? ticketCreateErr['details.0.fromAddress'] : null }
																	placeholder={ "Address (from)" }
																	title={ detailsFormData.fromAddress }
																	onChange={ (event) => this.handleChangeDetails('fromAddress', event.target.value) }
																/>
															</label>
															<h4>City (from)</h4>
															<br/>
															<div className="update__latLon_row">
																<label className='coords__update_label'>
																	<p>Latitude</p><br/>
																	<Input
																		size={ 'small' }
																		value={ coords && coords[0] ? coords[0] : '' }
																		onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
																		placeholder="Latitude"
																		error={ ticketCreateErr['details.0.fromCity'] ? ticketCreateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
																	/>
																</label>&ensp;
																<label className='coords__update_label'>
																	<p>Longitude</p><br/>
																	<Input
																		size={ 'small' }
																		value={ coords && coords[1] ? coords[1] : '' }
																		onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
																		placeholder="Longitude"
																		error={ ticketCreateErr['details.0.fromCity'] ? ticketCreateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
																	/>
																</label>&ensp;
																<div className='coords__update_label'>
																	<Button onClick={ () => this.handleSubmitCoords('fromCity') }
																	        className={ "add__user" }
																	        variant="contained" title="Save">
																		Save
																	</Button>
																</div>
															</div>
															<YMap onClick={ (ev) => this.onMapClick(ev, 'fromCity') }
															      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), 'fromCity') }
															      coords={ !_.isEmpty(coords) ? coords : detailsFormData?.fromCity }
															      state={ !_.isEmpty(coords) ? coords : detailsFormData?.fromCity }
															/>
															<br/>
															<p className="err">
																{ ticketCreateErr['details.0.fromCity'] ? ticketCreateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
															</p>
														</div>
													}
												/>
												<br/>
												<p className="err center">{ ticketCreateErr.fromAddress ? ticketCreateErr.fromAddress :
													ticketCreateErr['details.0.fromAddress'] ? ticketCreateErr['details.0.fromAddress'] : null }</p>
												<br/>
												<p className="err center">
													{ ticketCreateErr['details.0.fromCity'] ? ticketCreateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
												</p>
											</div>
											<div className='country__update_label'>
												<p>Location (to)</p><br/>
												<ModalButton
													title={ "Doubleclick to add location" }
													label={ "Add Location" }
													className={ 'w100' }
													db={ true }
													div={ <div
														className="center ticket_location">{ detailsFormData.toAddress ? detailsFormData.toAddress + ', ' : '-' }
														{ detailsFormData.toCity ? detailsFormData.toCity?.[0] + ' - ' + detailsFormData.toCity?.[1] : ", -" }
													</div> }
													c={ true }
													input={
														<div className="user__create_content">
															<label className='country__update_label'>
																<h4>Address (to)</h4><br/>
																<Input
																	size={ 'small' }
																	type={ "text" }
																	value={ detailsFormData.toAddress ? detailsFormData.toAddress : '' }
																	className="driver__filter_label"
																	errors={ ticketCreateErr.toAddress ? ticketCreateErr.toAddress :
																		ticketCreateErr['details.0.toAddress'] ? ticketCreateErr['details.0.toAddress'] : null }
																	placeholder={ "Address (to)" }
																	title={ detailsFormData.toAddress }
																	onChange={ (event) => this.handleChangeDetails('toAddress', event.target.value) }
																/>
															</label>
															<h4>City (to)</h4>
															<br/>
															<div className="update__latLon_row">
																<label className='coords__update_label'>
																	<p>Latitude</p><br/>
																	<Input
																		size={ 'small' }
																		value={ coords2 && coords2[0] ? coords2[0] : '' }
																		onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
																		placeholder="Latitude"
																		error={ ticketCreateErr['details.0.toCity'] ? ticketCreateErr['details.0.toCity'].replaceAll('_', ' ') : null }
																	/>
																</label>&ensp;
																<label className='coords__update_label'>
																	<p>Longitude</p><br/>
																	<Input
																		size={ 'small' }
																		value={ coords2 && coords2[1] ? coords2[1] : '' }
																		onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
																		placeholder="Longitude"
																		error={ ticketCreateErr['details.0.toCity'] ? ticketCreateErr['details.0.toCity'].replaceAll('_', ' ') : null }
																	/>
																</label>&ensp;
																<div className='coords__update_label'>
																	<Button onClick={ () => this.handleSubmitCoords('toCity') }
																	        className={ "add__user" }
																	        variant="contained" title="Save">
																		Save
																	</Button>
																</div>
															</div>
															<YMap onClick={ (ev) => this.onMapClick(ev, 'toCity') }
															      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), 'toCity') }
															      coords={ !_.isEmpty(coords2) ? coords2 : detailsFormData?.toCity }
															      state={ !_.isEmpty(coords2) ? coords2 : detailsFormData?.toCity }
															/>
															<br/>
															<p className="err">
																{ ticketCreateErr['details.0.toCity'] ? ticketCreateErr['details.0.toCity'].replaceAll('_', ' ') : null }
															</p>
														</div>
													}
												/>
												<br/>
												<p className="err center">{ ticketCreateErr.toAddress ? ticketCreateErr.toAddress :
													ticketCreateErr['details.0.toAddress'] ? ticketCreateErr['details.0.toAddress'] : null }</p>
												<br/>
												<p className="err center">
													{ ticketCreateErr['details.0.toCity'] ? ticketCreateErr['details.0.toCity'].replaceAll('_', ' ') : null }
												</p>
											</div>
											<hr/>
											<br/>
											<label className="country__update_label">
												<p>Parcel Weight</p><br/>
												<Input
													size={ 'small' }
													type={ "number" }
													value={ detailsFormData.kg ? detailsFormData.kg : '' }
													className="driver__filter_label ticket_input"
													inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
													errors={ ticketCreateErr.kg ? ticketCreateErr.kg :
														ticketCreateErr['details.0.kg'] ? ticketCreateErr['details.0.kg'] : null }
													placeholder={ "Parcel Weight" }
													title={ detailsFormData.kg }
													onChange={ (event) => this.handleChangeDetails('kg', validateInput(event.target.value)) }
												/>
											</label>
											<label className="country__update_label">
												<p>Description</p><br/>
												<Input
													size={ 'small' }
													type={ "text" }
													mask={ "************************************************************" }
													maskChar={ '' }
													formatChars={ {'*': '[A-Za-z0-9 ]'} }
													className="driver__filter_label ticket_input"
													errors={ ticketCreateErr.description ? ticketCreateErr.description :
														ticketCreateErr['details.0.description'] ? ticketCreateErr['details.0.description'] : null }
													placeholder={ "Description" }
													title={ detailsFormData.description }
													onChange={ (event) => this.handleChangeDetails('description', event.target.value) }
												/>
											</label>
											<div className='dfj'>
												<label className='ticket__update_label'>
													<p>Sender Phone Number</p><br/>
													<PhoneInput
														className="ticket_input"
														value={ detailsFormData.senderPhoneNumber ? detailsFormData.senderPhoneNumber : '' }
														errors={ ticketCreateErr.senderPhoneNumber ? ErrorEnum[ticketCreateErr.senderPhoneNumber]
																? ErrorEnum[ticketCreateErr.senderPhoneNumber] : ticketCreateErr.senderPhoneNumber.replaceAll('_', ' ') :
															ticketCreateErr['details.0.senderPhoneNumber'] ? ticketCreateErr['details.0.senderPhoneNumber'] : null }
														title={ detailsFormData.senderPhoneNumber }
														onChange={ (event) => this.handleChangeDetails('senderPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
													/>
													{ _.isEmpty(detailsFormData.senderPhoneNumber) && userPhone?.phoneNumber ? <div
														className="recommended_number"
														onClick={ () => this.handleChangeDetails('senderPhoneNumber', userPhone?.phoneNumber) }>
														{ userPhone?.phoneNumber }
													</div> : null }
												</label>
												<label className='ticket__update_label'>
													<p>Receiver Phone Number</p><br/>
													<PhoneInput
														className="ticket_input"
														value={ detailsFormData.receiverPhoneNumber ? detailsFormData.receiverPhoneNumber : '' }
														errors={ ticketCreateErr.receiverPhoneNumber ? ErrorEnum[ticketCreateErr.receiverPhoneNumber]
																? ErrorEnum[ticketCreateErr.receiverPhoneNumber] : ticketCreateErr.receiverPhoneNumber.replaceAll('_', ' ') :
															ticketCreateErr['details.0.receiverPhoneNumber'] ? ticketCreateErr['details.0.receiverPhoneNumber'] : null }
														title={ detailsFormData.receiverPhoneNumber }
														onChange={ (event) => this.handleChangeDetails('receiverPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
													/>
													{ _.isEmpty(detailsFormData.receiverPhoneNumber) && userPhone?.phoneNumber ? <div
														className="recommended_number"
														onClick={ () => this.handleChangeDetails('receiverPhoneNumber', userPhone?.phoneNumber) }>
														{ userPhone?.phoneNumber }
													</div> : null }
												</label>
											</div>
											<br/>
										</div>
										: null }
								<br/>
								<label className='country__update_label'>
									<p>Payment</p><br/>
									<Selects
										size={ "small" }
										df={ 'Choose Payment' }
										className="service__details_input"
										data={ [{id: 1, name: 'Inercity T'}, {id: 2, name: 'Cargo T'}] }
										value={ createFormData.method ? createFormData.method : '' }
										errors={ ticketCreateErr.method ? ticketCreateErr.method : null }
										vName={ 'name' }
										keyValue={ 'id' }
										onChange={ (event) => this.handleChange('method', event.target.value) }
									/>
								</label>
								<label className="country__update_label">
									<p>Promo Code</p><br/>
									<Input
										size={ 'small' }
										type={ "text" }
										value={ createFormData.promoCode ? createFormData.promoCode : '' }
										className={ 'user__create_input' }
										errors={ ticketCreateErr.promoCode ? ticketCreateErr.promoCode : null }
										placeholder={ "Promo Code" }
										title={ createFormData.promoCode }
										onChange={ (event) => this.handleChange('promoCode', event.target.value) }
									/>
								</label>
								<br/>
								<div className="country__update_label">
									<InputRadio
										label={ 'Status' }
										data={ [{value: 1, name: "Pending"}, {value: 2, name: "Start"},
											{value: 3, name: "Cancel"}, {value: 4, name: "End"}] }
										value={ createFormData.status ? +createFormData.status : 1 }
										onChange={ (event) => this.handleChange('status', event.target.value) }
									/>
								</div>
							</div>
							<div className="update__buttons_row">
								<NavLink to='/ticket'>
									<Button title="Cancel" className="add__user" variant="contained">
										Cancel
									</Button>
								</NavLink>
								<Button onClick={ this.handleSubmit }
								        className={ _.isEmpty(createFormData) || ticketCreateStatus === "request" ? "" : "add__user" }
								        disabled={ _.isEmpty(createFormData) || ticketCreateStatus === "request" }
								        variant="contained" title="Save">
									{ ticketCreateStatus === 'request' ? 'Wait...' : 'Submit' }
								</Button>
							</div>
						</div>
					</div>
					<Results/>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	ticketCreate: state.service.ticketCreate,
	ticketCreateErr: state.service.ticketCreateErr,
	ticketCreateStatus: state.service.ticketCreateStatus,
	allUsers: state.users.allUsers,
	service: state.service.service,
	allServices: state.service.allServices,
})

const mapDispatchToProps = {
	getTickets,
	getService,
	getServices,
	getSelectUsers,
	createTicket,
}

const AddTicketContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddTicket)

export default AddTicketContainer;
