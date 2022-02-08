import React, { Component } from 'react';
import _ from "lodash";
import { Close } from "@material-ui/icons";
import { Button } from "@mui/material";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import Input from "../components/form/Input";
import InputRadio from "../components/form/Radio";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deletingTicket, deletingTicketDetail, getOneTicket, updateTicket } from "../store/actions/admin/service";
import Selects from "../components/form/Select";
import Switcher from "../components/form/Switch";
import ModalButton from "../components/modals/modal";
import YMap from "../components/map/ymap";
import ErrorEnum from "../helpers/ErrorHandler";
import PhoneInput from "../components/form/PhoneInput";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation";
import { getSelectUsers } from "../store/actions/admin/users";

class TicketUpdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.page,
			updateFormData: {},
			detailsFormData: {},
			openDetails: false,
			coords: [],
			coords2: [],
			interFormData: [],
			s: '',
		};
		this.props.getOneTicket(this.props.match.params.page);
	}

	componentDidMount() {
		const {ticket} = this.props;
		if (ticket){
			this.setState({
				updateFormData: {serviceType: +ticket.serviceTicket?.type},
				interFormData: ticket.detailsPassenger ? ticket.detailsPassenger : [],
			});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const id = this.props.match.params.page;
		const {ticket} = this.props;
		if (prevProps.ticket !== ticket){
			this.setState({
				updateFormData: {serviceType: +ticket.serviceTicket?.type},
				interFormData: ticket.detailsPassenger ? ticket.detailsPassenger : []
			});
		}
		if (prevState.id !== id){
			this.setState({id});
		}
		if (prevState.updateFormData !== this.state.updateFormData){
			return this.state.updateFormData;
		}
		if (prevProps.ticketUpdate !== this.props.ticketUpdate){
			return this.props.ticketUpdate;
		}
	}

	handleSearchSelect = (path, ev) => {
		if (path === 's'){
			this.props.getSelectUsers(1, ev);
		}
		this.setState({s: ev});
	}

	handleChange = (path, ev) => {
		const {updateFormData} = this.state;
		_.set(updateFormData, path, _.trim(ev));
		this.setState({updateFormData})
	}

	handleSubmit = (ev) => {
		const {updateFormData, id} = this.state;
		_.set(updateFormData, "id", ev);
		this.setState({updateFormData});
		this.props.updateTicket(updateFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getOneTicket(id);
				this.setState({updateFormData: {}, detailsFormData: {}, interFormData: [], coords: [], coords2: []});
			}
		})
	}

	handleChangeDetails = (path, ev) => {
		const {detailsFormData, updateFormData} = this.state;
		const {ticket} = this.props;
		if (path === 'kg'){
			if (!_.isEmpty(ticket)){
				const details = ticket?.serviceTicket;
				if (+ev <= +details?.availableCount){
					_.set(detailsFormData, path, _.trim(ev));
				}
			}
		} else{
			_.set(detailsFormData, path, _.trim(ev));
		}
		if (ticket?.detailsCargo?.id){
			_.set(detailsFormData, "id", _.trim(+ticket?.detailsCargo?.id));
		}
		const details = [];
		if (!_.isEmpty(detailsFormData)){
			details.push(detailsFormData);
		}
		_.set(updateFormData, "details", details);
		this.setState({detailsFormData, updateFormData});
	}

	handleClose = (type, i, detailsId) => {
		const {id} = this.state;
		if (i){
			this.props.deletingTicketDetail(i, detailsId, type).then((d) => {
				if (d.payload.data.status === true){
					this.props.getOneTicket(id);
				}
			})
		}
		this.setState((state) => {
			return {
				openDetails: false, detailsFormData: {},
				updateFormData: {...state.updateFormData, details: void 0}
			}
		});
	}

	onMapClick = (ev, path, k) => {
		const {updateFormData, detailsFormData, interFormData} = this.state;
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		if (+updateFormData.serviceType === 1){
			_.set(interFormData[k], path, coords);
			if (path === 'toCity'){
				this.setState({coords2: coords});
			} else{
				this.setState({coords});
			}
			_.set(updateFormData, "details", interFormData);
			this.setState({interFormData, updateFormData});
		}
		if (+updateFormData.serviceType === 2){
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
			_.set(updateFormData, "details", details);
			this.setState({detailsFormData, updateFormData})
		}
	}
	handleChangeCoords = (path, ev) => {
		const {coords} = this.state;
		const {ticket} = this.props;
		if (path === "lat"){
			coords[0] = +ev;
			if (!coords[1]){
				coords[1] = ticket.detailsCargo?.fromCity && ticket.detailsCargo?.fromCity[1] ? ticket.detailsCargo?.fromCity[1] :
					ticket.detailsPassenger?.fromCity && ticket.detailsPassenger?.fromCity[1] ? ticket.detailsPassenger?.fromCity[1] : ''
			}
		}
		if (path === "lon"){
			coords[1] = +ev;
			if (!coords[0]){
				coords[0] = ticket.detailsCargo?.fromCity && ticket.detailsCargo?.fromCity[0] ? ticket.detailsCargo?.fromCity[0] :
					ticket.detailsPassenger?.fromCity && ticket.detailsPassenger?.fromCity[0] ? ticket.detailsPassenger?.fromCity[0] : ''
			}
		}
		this.setState({coords})
	}
	handleChangeCoords2 = (path, ev) => {
		const {coords2} = this.state;
		const {ticket} = this.props;
		if (path === "lat"){
			coords2[0] = +ev;
			if (!coords2[1]){
				coords2[1] = ticket.detailsCargo?.toCity && ticket.detailsCargo?.toCity[1] ? ticket.detailsCargo?.toCity[1] :
					ticket.detailsPassenger?.toCity && ticket.detailsPassenger?.toCity[1] ? ticket.detailsPassenger?.toCity[1] : ''
			}
		}
		if (path === "lon"){
			coords2[1] = +ev;
			if (!coords2[0]){
				coords2[0] = ticket.detailsCargo?.toCity && ticket.detailsCargo?.toCity[0] ? ticket.detailsCargo?.toCity[0] :
					ticket.detailsPassenger?.toCity && ticket.detailsPassenger?.toCity[0] ? ticket.detailsPassenger?.toCity[0] : ''
			}
		}
		this.setState({coords2})
	}
	handleSubmitCoords = (path, k) => {
		const {updateFormData, detailsFormData, interFormData, coords, coords2} = this.state;
		if (+updateFormData.serviceType === 1){
			_.set(interFormData[k], path, path === 'toCity' ? coords2 : coords);
			_.set(updateFormData, "details", interFormData);
			this.setState({interFormData});
		}
		if (+updateFormData.serviceType === 2){
			_.set(detailsFormData, path, path === 'toCity' ? coords2 : coords);
			const details = [];
			if (!_.isEmpty(detailsFormData)){
				details.push(detailsFormData);
			}
			_.set(updateFormData, "details", details);
			this.setState({detailsFormData});
		}
		this.setState({updateFormData, coords2: [], coords: []});
	}

	addDetail = () => {
		const {updateFormData, interFormData} = this.state;
		const {ticket} = this.props;
		if (+updateFormData.serviceType === 1){
			if (!_.isEmpty(ticket)){
				const details = ticket?.serviceTicket;
				if (+interFormData.length < +details?.availableCount){
					const x = _.findLast(interFormData, (n) => (n));
					const seat = x?.passengerSeat ? +x.passengerSeat + 1 : 1;
					const y = _.find(interFormData, ['passengerSeat', seat.toString()]);
					interFormData.push({passengerSeat: seat <= +details?.availableCount && !y ? seat : ''});
				}
			}
			this.setState({interFormData})
		}
		if (+updateFormData.serviceType === 2){
			this.setState({openDetails: true})
		}
	}

	handleCloseInter = (i, detailsId, type) => {
		const {interFormData, updateFormData} = this.state;
		const removeId = interFormData[i];
		if (removeId && removeId.id){
			this.props.deletingTicketDetail(removeId.id, detailsId, type)
		}
		interFormData.splice(i, 1);
		this.setState({
			interFormData,
			updateFormData: {...updateFormData, details: _.isEmpty(interFormData) ? void 0 : interFormData},
		});
	}

	handleChangeIntercity = (path, ev, k) => {
		const {interFormData, updateFormData} = this.state;
		const {ticket} = this.props;
		if (path === 'passengerSeat'){
			const detail = ticket?.serviceTicket;
			const y = _.find(interFormData, ['passengerSeat', ev]);
			if (+ev <= +detail?.availableCount && !y){
				_.set(interFormData[k], path, ev);
			}
		} else{
			_.set(interFormData[k], path, ev);
		}
		_.set(updateFormData, "details", interFormData);
		this.setState({interFormData, updateFormData})
	}

	render() {
		const {ticketUpdateErr, allUsers, ticket, ticketStatus, ticketUpdateStatus} = this.props;
		const {updateFormData, detailsFormData, interFormData, openDetails, coords, coords2, s} = this.state;
		const userPhone = _.find(allUsers?.array || [], ['id', +updateFormData.user]);

		return (
			<Wrapper showFooter={ false }>
				<div className="container">
					{ ticketStatus === 'success' && ticket ?
						<div className="add__content">
							<div className="user__header">
								<h3 className="users__title">Edit Ticket</h3>
								<NavLink to={ '/ticket' } title="Close"><Close/></NavLink>
							</div>
							<div className="country__filter_area">
								<div className="country__update_content">
									<label className='country__update_label'>
										<p>Service Type</p><br/>
										<Selects
											size={ "small" }
											df={ 'Choose Type' }
											className={ `service__details_input ${ updateFormData.serviceType && +updateFormData.serviceType
											!== +ticket?.serviceTicket?.type ? 'in_border' : null }` }
											data={ +ticket?.serviceTicket?.type === 1 ? [{id: 1, name: 'Inercity T'}] :
												+ticket?.serviceTicket?.type === 2 ? [{id: 2, name: 'Cargo T'}] :
													[{id: 1, name: 'Inercity T'}, {id: 2, name: 'Cargo T'}]
											}
											value={ updateFormData.serviceType ? updateFormData.serviceType :
												ticket.serviceTicket?.type ? +ticket.serviceTicket.type : '' }
											errors={ ticketUpdateErr.serviceType ? ticketUpdateErr.serviceType : null }
											vName={ 'name' }
											keyValue={ 'id' }
											onChange={ (event) => this.handleChange('serviceType', event.target.value) }
										/>
									</label>
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
											value={ ticket?.ticketUser ? {
												value: ticket.ticketUser?.id,
												label: `${ ticket.ticketUser?.id }) ${ ticket.ticketUser?.firstName }
                         ${ ticket.ticketUser?.lastName } | ${ ticket.ticketUser?.phoneNumber } | ${ ticket.ticketUser?.username }`,
											} : '' }
											errors={ ticketUpdateErr.user ? ticketUpdateErr.user.replaceAll('_', ' ') : null }
										/>
									</label>
									<div className="dfa">Add Ticket Details &ensp;
										<FontAwesomeIcon
											icon={ faPlusSquare } className="add__service_button"
											onClick={ () => this.addDetail() }
										/>
									</div>
									<br/>
									{ +updateFormData.serviceType === 1 ?
										<div className='dfj add__ticket_details'>{
											_.map(interFormData, (v, k) => (
												v ? <div className="ticket_details intercity_details" key={ k }>
                          <span className="close_details" title="Remove details"
                                onClick={ () => this.handleCloseInter(k, ticket?.serviceDetailsId, 1) }><Close/></span>
													<div className="country__update_label">
														<InputRadio
															label={ 'State' }
															data={ [{value: 1, name: "Pending"}, {value: 2, name: "Start"},
																{value: 3, name: "Cancel"}, {value: 4, name: "End"}] }
															value={ v?.state ? +v.state : 1 }
															onChange={ (event) => this.handleChangeIntercity('state', event.target.value, k) }
														/>
														<p className="err">
															{ ticketUpdateErr[`details.${ k }.state`] ? ticketUpdateErr[`details.${ k }.state`] : null }
														</p>
													</div>
													<div className='country__update_label'>
														<p>Location (from)</p><br/>
														<ModalButton
															title={ "Doubleclick to add location" }
															label={ "Add Location" }
															className={ 'w100 details_button' }
															db={ true }
															div={ <div
																className="center ticket_location">{ v.fromAddress ? v.fromAddress + ', ' : '-' }
																{ v.fromCity ? v.fromCity?.[0] + ' - ' + v.fromCity[1] : ", -" }</div> }
															c={ true }
															input={
																<div className="user__create_content">
																	<label className='country__update_label'>
																		<h4>Address (from)</h4><br/>
																		<Input
																			size={ 'small' }
																			defaultValue={ v?.fromAddress }
																			type={ "text" }
																			className="driver__filter_label"
																			errors={ ticketUpdateErr.fromAddress ? ticketUpdateErr.fromAddress :
																				ticketUpdateErr[`details.${ k }.fromAddress`] ? ticketUpdateErr[`details.${ k }.fromAddress`] : null }
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
																				className={ coords && coords[0] ? 'in_border' : null }
																				value={ coords?.[0] ? coords?.[0] : coords?.[0] === '' ? '' : undefined }
																				defaultValue={ coords?.[0] ? undefined : v?.fromCity?.[0] }
																				onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
																				placeholder="Latitude"
																				error={ ticketUpdateErr[`details.${ k }.fromCity`] ? ticketUpdateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
																			/>
																		</label>&ensp;
																		<label className='coords__update_label'>
																			<p>Longitude</p><br/>
																			<Input
																				size={ 'small' }
																				className={ coords && coords[1] ? 'in_border' : null }
																				value={ coords?.[1] ? coords?.[1] : coords?.[1] === '' ? '' : undefined }
																				defaultValue={ coords?.[1] ? undefined : v?.fromCity?.[1] }
																				onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
																				placeholder="Longitude"
																				error={ ticketUpdateErr[`details.${ k }.fromCity`] ? ticketUpdateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
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
																		{ ticketUpdateErr[`details.${ k }.fromCity`] ? ticketUpdateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
																	</p>
																</div>
															}
														/>
														<br/>
														<p className="err center">{ ticketUpdateErr.fromAddress ? ticketUpdateErr.fromAddress :
															ticketUpdateErr[`details.${ k }.fromAddress`] ? ticketUpdateErr[`details.${ k }.fromAddress`] : null }</p>
														<br/>
														<p className="err center">
															{ ticketUpdateErr[`details.${ k }.fromCity`] ? ticketUpdateErr[`details.${ k }.fromCity`].replaceAll('_', ' ') : null }
														</p>
													</div>
													<div className='country__update_label'>
														<p>Location (to)</p><br/>
														<ModalButton
															title={ "Doubleclick to add location" }
															label={ "Add Location" }
															className={ 'w100 details_button' }
															db={ true }
															div={ <div
																className="center ticket_location">{ v.toAddress ? v.toAddress + ', ' : '-' }
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
																			defaultValue={ v?.toAddress }
																			className="driver__filter_label"
																			errors={ ticketUpdateErr.toAddress ? ticketUpdateErr.toAddress :
																				ticketUpdateErr[`details.${ k }.toAddress`] ? ticketUpdateErr[`details.${ k }.toAddress`] : null }
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
																				className={ coords2 && coords2[0] ? 'in_border' : null }
																				value={ coords2?.[0] ? coords2?.[0] : coords2?.[0] === '' ? '' : undefined }
																				defaultValue={ coords2?.[0] ? undefined : v?.toCity?.[0] }
																				onChange={ (ev) => this.handleChangeCoords2('lat', ev.target.value) }
																				placeholder="Latitude"
																				error={ ticketUpdateErr[`details.${ k }.toCity`] ? ticketUpdateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
																			/>
																		</label>&ensp;
																		<label className='coords__update_label'>
																			<p>Longitude</p><br/>
																			<Input
																				size={ 'small' }
																				className={ coords2 && coords2[1] ? 'in_border' : null }
																				value={ coords2?.[1] ? coords2?.[1] : coords2?.[1] === '' ? '' : undefined }
																				defaultValue={ coords2?.[1] ? undefined : v?.toCity?.[1] }
																				onChange={ (ev) => this.handleChangeCoords2('lon', ev.target.value) }
																				placeholder="Longitude"
																				error={ ticketUpdateErr[`details.${ k }.toCity`] ? ticketUpdateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
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
																		{ ticketUpdateErr[`details.${ k }.toCity`] ? ticketUpdateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
																	</p>
																</div>
															}
														/>
														<br/>
														<p className="err center">{ ticketUpdateErr.toAddress ? ticketUpdateErr.toAddress :
															ticketUpdateErr[`details.${ k }.toAddress`] ? ticketUpdateErr[`details.${ k }.toAddress`] : null }</p>
														<br/>
														<p className="err center">
															{ ticketUpdateErr[`details.${ k }.toCity`] ? ticketUpdateErr[`details.${ k }.toCity`].replaceAll('_', ' ') : null }
														</p>
													</div>
													<hr/>
													<br/>
													<label className="country__update_label">
														<p>Passenger Phone Number</p><br/>
														<PhoneInput
															className="ticket_input"
															defaultValue={ v?.passengerPhoneNumber }
															errors={ ticketUpdateErr.passengerPhoneNumber ? ErrorEnum[ticketUpdateErr.passengerPhoneNumber]
																	? ErrorEnum[ticketUpdateErr.passengerPhoneNumber] : ticketUpdateErr.passengerPhoneNumber.replaceAll('_', ' ') :
																ticketUpdateErr[`details.${ k }.passengerPhoneNumber`] ? ticketUpdateErr[`details.${ k }.passengerPhoneNumber`] : null }
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
																value={ v?.passengerSeat }
																className="driver__filter_label ticket_input"
																inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
																errors={ ticketUpdateErr.passengerSeat ? ticketUpdateErr.passengerSeat :
																	ticketUpdateErr[`details.${ k }.passengerSeat`] ? ticketUpdateErr[`details.${ k }.passengerSeat`] : null }
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
										openDetails || ticket?.detailsCargo ? <div className="ticket_details">
                        <span className="close_details" title="Remove details"
                              onClick={ () => this.handleClose(2, ticket?.detailsCargo?.id, ticket?.serviceDetailsId) }>
                          <Close/></span>
												<div className="country__update_label">
													<InputRadio
														label={ 'State' }
														data={ [{value: 1, name: "Pending"}, {value: 2, name: "Start"},
															{value: 3, name: "Cancel"}, {value: 4, name: "End"}] }
														value={ detailsFormData.state ? +detailsFormData.state :
															ticket.detailsCargo?.state ? +ticket.detailsCargo.state : 1 }
														onChange={ (event) => this.handleChangeDetails('state', event.target.value) }
													/>
													<p className="err">
														{ ticketUpdateErr['details.0.state'] ? ticketUpdateErr['details.0.state'] : null }
													</p>
												</div>
												<div className='country__update_label'>
													<p>Location (from)</p><br/>
													<ModalButton
														title={ "Doubleclick to add location" }
														label={ "Add Location" }
														className={ 'w100 details_button' }
														db={ true }
														div={ <div
															className="center ticket_location">{
															detailsFormData.fromAddress ? detailsFormData.fromAddress + ', ' :
																ticket.detailsCargo?.fromAddress ? ticket.detailsCargo.fromAddress + ', ' : '-' }
															{ detailsFormData.fromCity ? detailsFormData.fromCity?.[0] + ' - ' + detailsFormData.fromCity?.[1] :
																ticket.detailsCargo?.fromCity ? ticket.detailsCargo.fromCity?.[0] + ' - ' + ticket.detailsCargo.fromCity[1] : ", -"
															}</div> }
														c={ true }
														input={
															<div className="user__create_content">
																<label className='country__update_label'>
																	<h4>Address (from)</h4><br/>
																	<Input
																		size={ 'small' }
																		defaultValue={ ticket.detailsCargo?.fromAddress }
																		type={ "text" }
																		className={ `driver__filter_label ${ detailsFormData.fromAddress && detailsFormData.fromAddress
																		!== ticket?.detailsCargo?.fromAddress ? 'in_border' : null }` }
																		errors={ ticketUpdateErr.fromAddress ? ticketUpdateErr.fromAddress :
																			ticketUpdateErr['details.0.fromAddress'] ? ticketUpdateErr['details.0.fromAddress'] : null }
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
																			className={ coords && coords[0] ? 'in_border' : null }
																			value={ coords?.[0] ? coords?.[0] : coords?.[0] === '' ? '' : undefined }
																			defaultValue={ coords?.[0] ? undefined : ticket.detailsCargo?.fromCity?.[0] }
																			onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
																			placeholder="Latitude"
																			error={ ticketUpdateErr['details.0.fromCity'] ? ticketUpdateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<label className='coords__update_label'>
																		<p>Longitude</p><br/>
																		<Input
																			size={ 'small' }
																			className={ coords && coords[1] ? 'in_border' : null }
																			value={ coords?.[1] ? coords?.[1] : coords?.[1] === '' ? '' : undefined }
																			defaultValue={ coords?.[1] ? undefined : ticket.detailsCargo?.fromCity?.[1] }
																			onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
																			placeholder="Longitude"
																			error={ ticketUpdateErr['details.0.fromCity'] ? ticketUpdateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<div className='coords__update_label'>
																		<Button
																			onClick={ () => this.handleSubmitCoords('fromCity') }
																			className={ "add__user" }
																			variant="contained" title="Save">
																			Save
																		</Button>
																	</div>
																</div>
																<YMap onClick={ (ev) => this.onMapClick(ev, 'fromCity') }
																      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), 'fromCity') }
																      coords={ !_.isEmpty(coords) ? coords : ticket?.detailsCargo?.fromCity }
																      state={ !_.isEmpty(coords) ? coords : ticket?.detailsCargo?.fromCity }
																/>
																<br/>
																<p className="err">
																	{ ticketUpdateErr['details.0.fromCity'] ? ticketUpdateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
																</p>
															</div>
														}
													/>
													<br/>
													<p className="err center">{ ticketUpdateErr.fromAddress ? ticketUpdateErr.fromAddress :
														ticketUpdateErr['details.0.fromAddress'] ? ticketUpdateErr['details.0.fromAddress'] : null }</p>
													<br/>
													<p className="err center">
														{ ticketUpdateErr['details.0.fromCity'] ? ticketUpdateErr['details.0.fromCity'].replaceAll('_', ' ') : null }
													</p>
												</div>
												<div className='country__update_label'>
													<p>Location (to)</p><br/>
													<ModalButton
														title={ "Doubleclick to add location" }
														label={ "Add Location" }
														className={ 'w100 details_button' }
														db={ true }
														div={ <div
															className="center ticket_location">{
															detailsFormData.toAddress ? detailsFormData.toAddress + ', ' :
																ticket.detailsCargo?.toAddress ? ticket.detailsCargo.toAddress + ', ' : '-' }
															{ detailsFormData.toCity ? detailsFormData.toCity?.[0] + ' - ' + detailsFormData.toCity?.[1] :
																ticket.detailsCargo?.toCity ? ticket.detailsCargo.toCity?.[0] + ' - ' + ticket.detailsCargo.toCity[1] : ", -"
															}</div> }
														c={ true }
														input={
															<div className="user__create_content">
																<label className='country__update_label'>
																	<h4>Address (to)</h4><br/>
																	<Input
																		size={ 'small' }
																		defaultValue={ ticket.detailsCargo?.toAddress }
																		type={ "text" }
																		className={ `driver__filter_label ${ detailsFormData.toAddress && detailsFormData.toAddress
																		!== ticket?.detailsCargo?.toAddress ? 'in_border' : null }` }
																		errors={ ticketUpdateErr.toAddress ? ticketUpdateErr.toAddress :
																			ticketUpdateErr['details.0.toAddress'] ? ticketUpdateErr['details.0.toAddress'] : null }
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
																			className={ coords2 && coords2[0] ? 'in_border' : null }
																			value={ coords2?.[0] ? coords2?.[0] : coords2?.[0] === '' ? '' : undefined }
																			defaultValue={ coords2?.[0] ? undefined : ticket.detailsCargo?.toCity?.[0] }
																			onChange={ (ev) => this.handleChangeCoords2('lat', ev.target.value) }
																			placeholder="Latitude"
																			error={ ticketUpdateErr['details.0.toCity'] ? ticketUpdateErr['details.0.toCity'].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<label className='coords__update_label'>
																		<p>Longitude</p><br/>
																		<Input
																			size={ 'small' }
																			className={ coords2 && coords2[1] ? 'in_border' : null }
																			value={ coords2?.[1] ? coords2?.[1] : coords2?.[1] === '' ? '' : undefined }
																			defaultValue={ coords2?.[1] ? undefined : ticket.detailsCargo?.toCity?.[1] }
																			onChange={ (ev) => this.handleChangeCoords2('lon', ev.target.value) }
																			placeholder="Longitude"
																			error={ ticketUpdateErr['details.0.toCity'] ? ticketUpdateErr['details.0.toCity'].replaceAll('_', ' ') : null }
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
																      coords={ !_.isEmpty(coords2) ? coords2 : ticket?.detailsCargo?.toCity }
																      state={ !_.isEmpty(coords2) ? coords2 : ticket?.detailsCargo?.toCity }
																/>
																<br/>
																<p className="err">
																	{ ticketUpdateErr['details.0.toCity'] ? ticketUpdateErr['details.0.toCity'].replaceAll('_', ' ') : null }
																</p>
															</div>
														}
													/>
													<br/>
													<p className="err center">{ ticketUpdateErr.toAddress ? ticketUpdateErr.toAddress :
														ticketUpdateErr['details.0.toAddress'] ? ticketUpdateErr['details.0.toAddress'] : null }</p>
													<br/>
													<p className="err center">
														{ ticketUpdateErr['details.0.toCity'] ? ticketUpdateErr['details.0.toCity'].replaceAll('_', ' ') : null }
													</p>
												</div>
												<hr/>
												<br/>
												<label className="country__update_label">
													<p>Parcel Weight</p><br/>
													<Input
														size={ 'small' }
														defaultValue={ detailsFormData.kg ? undefined : ticket.detailsCargo?.kg }
														value={ detailsFormData?.kg || undefined }
														type={ "number" }
														className={ `driver__filter_label ticket_input ${ detailsFormData.kg && +detailsFormData.kg
														!== +ticket?.detailsCargo?.kg ? 'in_border' : null }` }
														inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
														errors={ ticketUpdateErr.kg ? ticketUpdateErr.kg :
															ticketUpdateErr['details.0.kg'] ? ticketUpdateErr['details.0.kg'] : null }
														placeholder={ "Parcel Weight" }
														title={ detailsFormData.kg }
														onChange={ (event) => this.handleChangeDetails('kg', validateInput(event.target.value)) }
													/>
												</label>
												<label className="country__update_label">
													<p>Description</p><br/>
													<Input
														size={ 'small' }
														defaultValue={ ticket.detailsCargo?.description }
														type={ "text" }
														mask={ "************************************************************" }
														maskChar={ '' }
														formatChars={ {'*': '[A-Za-z0-9 ]'} }
														className={ `driver__filter_label ticket_input ${ detailsFormData.description && detailsFormData.description
														!== ticket?.detailsCargo?.description ? 'in_border' : null }` }
														errors={ ticketUpdateErr.description ? ticketUpdateErr.description :
															ticketUpdateErr['details.0.description'] ? ticketUpdateErr['details.0.description'] : null }
														placeholder={ "Description" }
														title={ detailsFormData.description }
														onChange={ (event) => this.handleChangeDetails('description', event.target.value) }
													/>
												</label>
												<div className='dfj'>
													<label className='ticket__update_label'>
														<p>Sender Phone Number</p><br/>
														<PhoneInput
															className={ `ticket_input ${ detailsFormData.senderPhoneNumber && detailsFormData.senderPhoneNumber
															!== ticket?.detailsCargo?.senderPhoneNumber ? 'in_border' : null }` }
															defaultValue={ detailsFormData.senderPhoneNumber ? undefined : ticket.detailsCargo?.senderPhoneNumber }
															value={ detailsFormData.senderPhoneNumber || undefined }
															errors={ ticketUpdateErr.senderPhoneNumber ? ErrorEnum[ticketUpdateErr.senderPhoneNumber]
																	? ErrorEnum[ticketUpdateErr.senderPhoneNumber] : ticketUpdateErr.senderPhoneNumber.replaceAll('_', ' ') :
																ticketUpdateErr['details.0.senderPhoneNumber'] ? ticketUpdateErr['details.0.senderPhoneNumber'] : null }
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
															className={ `ticket_input ${ detailsFormData.receiverPhoneNumber && detailsFormData.receiverPhoneNumber
															!== ticket?.detailsCargo?.receiverPhoneNumber ? 'in_border' : null }` }
															defaultValue={ detailsFormData.receiverPhoneNumber ? undefined : ticket.detailsCargo?.receiverPhoneNumber }
															value={ detailsFormData.receiverPhoneNumber || undefined }
															errors={ ticketUpdateErr.receiverPhoneNumber ? ErrorEnum[ticketUpdateErr.receiverPhoneNumber]
																	? ErrorEnum[ticketUpdateErr.receiverPhoneNumber] : ticketUpdateErr.receiverPhoneNumber.replaceAll('_', ' ') :
																ticketUpdateErr['details.0.receiverPhoneNumber'] ? ticketUpdateErr['details.0.receiverPhoneNumber'] : null }
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
											className={ `service__details_input ${ updateFormData.method && updateFormData.method
											!== ticket?.detailsPay?.method ? 'in_border' : null }` }
											data={ [{id: 1, name: 'Inercity T'}, {id: 2, name: 'Cargo T'}] }
											value={ updateFormData.method ? updateFormData.method : ticket.detailsPay?.method ? ticket.detailsPay.method : '' }
											errors={ ticketUpdateErr.method ? ticketUpdateErr.method : null }
											vName={ 'name' }
											keyValue={ 'id' }
											onChange={ (event) => this.handleChange('method', event.target.value) }
										/>
									</label>
									<label className="country__update_label">
										<p>Promo Code</p><br/>
										<Input
											size={ 'small' }
											defaultValue={ ticket?.promoCode }
											type={ "text" }
											className={ `user__create_input ${ updateFormData.promoCode && updateFormData.promoCode
											!== ticket?.promoCode ? 'in_border' : null }` }
											errors={ ticketUpdateErr.promoCode ? ticketUpdateErr.promoCode : null }
											placeholder={ "Promo Code" }
											title={ updateFormData.promoCode }
											onChange={ (event) => this.handleChange('promoCode', event.target.value) }
										/>
									</label>
									<br/>
									<div className="country__update_label">
										<InputRadio
											label={ 'Status' }
											data={ [{value: 1, name: "Pending"}, {value: 2, name: "Start"},
												{value: 3, name: "Cancel"}, {value: 4, name: "End"}] }
											value={ updateFormData.status ? +updateFormData.status : ticket.status ? +ticket.status : 1 }
											onChange={ (event) => this.handleChange('status', event.target.value) }
										/>
									</div>
								</div>
								<div className="update__buttons_row">
									<ModalButton
										title={ "Delete Ticket" }
										label={ "Delete Ticket" }
										className={ "add__user" }
										cl={ 'log_out' }
										text={ "Are you sure you want to delete ticket?" }
										button={ "Delete" }
										enter={ "Yes" }
										onClick={ () => this.props.deletingTicket(ticket?.id).then((d) => {
											if (d.payload.data.status === true){
												this.props.getOneTicket(ticket?.id);
												this.props.history.push('/ticket');
											}
										}) }
									/>
									<Button onClick={ () => this.handleSubmit(ticket?.id) }
									        className={ Object.keys(updateFormData).length < 2 || ticketUpdateStatus === "request" ? "" : "add__user" }
									        disabled={ Object.keys(updateFormData).length < 2 || ticketUpdateStatus === "request" }
									        variant="contained" title="Save">
										{ ticketUpdateStatus === 'request' ? 'Wait...' : 'Save' }
									</Button>
								</div>
							</div>
						</div>
						: <><br/><p className="center">{ ticket ? 'loading...' : 'No such ticket' }</p></> }
					<Results/>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	allUsers: state.users.allUsers,
	ticket: state.service.ticket,
	ticketStatus: state.service.ticketStatus,
	ticketUpdate: state.service.ticketUpdate,
	ticketUpdateErr: state.service.ticketUpdateErr,
	ticketUpdateStatus: state.service.ticketUpdateStatus,
})

const mapDispatchToProps = {
	getOneTicket,
	getSelectUsers,
	updateTicket,
	deletingTicket,
	deletingTicketDetail,
}

const TicketUpdateContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(TicketUpdate)

export default TicketUpdateContainer;
