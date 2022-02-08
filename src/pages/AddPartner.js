import React, { Component } from 'react';
import _ from "lodash";
import { AddLocation, Close } from "@material-ui/icons";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import Input from "../components/form/Input";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPartner, getSelectDrivers, getSelectUsers } from "../store/actions/admin/users";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation"
import { Button } from "@mui/material";
import FileInput from "../components/form/FileInput";
import YMap from "../components/map/ymap";
import ModalButton from "../components/modals/modal";
import Switcher from "../components/form/Switch";
import { getCities, getCountries } from "../store/actions/admin/location";
import RouteMap from "../components/map/RouteMap";

class AddPartner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createFormData: {}, coords: [], branches: [{}], process: '', s: '',
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.createFormData !== this.state.createFormData){
			return this.state.createFormData;
		}
		if (prevProps.partnerCreate !== this.props.partnerCreate){
			return this.props.partnerCreate;
		}
	}

	handleSearchSelect = (path, ev) => {
		if (path === 's'){
			this.props.getSelectUsers(1, ev);
		}
		if (path === 'country'){
			this.props.getCountries(1, void 0, void 0, void 0, ev);
		}
		if (path === 'city'){
			this.props.getCities(1, void 0, void 0, void 0, ev);
		}
		if (path === 'driver'){
			this.props.getSelectDrivers(1, ev, true);
		}
		this.setState({s: ev});
	}

	addDetail = () => {
		const {branches} = this.state;
		branches.push({});
		this.setState({branches})
	}
	handleCloseDetail = (i) => {
		const {branches, createFormData} = this.state;
		branches.splice(i, 1);
		this.setState({
			branches, createFormData: {...createFormData, branches},
		});
	}
	handleChangeBranches = (path, ev, k) => {
		const {branches, createFormData} = this.state;
		if (path === 'drivers'){
			if (branches[k]?.['drivers']){
				branches[k]?.['drivers'].push(ev);
			} else{
				_.set(branches[k], path, [ev]);
			}
			_.set(branches[k], path, _.uniq(branches[k]?.['drivers']));
		} else{
			_.set(branches[k], path, ev);
		}
		_.set(createFormData, "branches", branches);
		this.setState({branches, createFormData})
	}

	closeAvd = (i, k) => {
		const {branches, createFormData} = this.state;
		branches[k]?.['drivers'].splice(i, 1);
		_.set(branches[k], 'drivers', _.uniq(branches[k]?.['drivers']));
		_.set(createFormData, "branches", branches);
		this.setState({createFormData});
	}

	onMapClick = (ev, path, k) => {
		const {createFormData, branches} = this.state;
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		_.set(branches[k], path, coords);
		_.set(createFormData, "branches", branches);
		this.setState({branches, coords, createFormData});
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

	handleSubmitCoords = (path, k) => {
		const {createFormData, branches, coords} = this.state;
		_.set(branches[k], path, coords);
		_.set(createFormData, "branches", branches);
		this.setState({branches})
		this.setState({createFormData, coords: []});
	}

	handleChange = (path, ev) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, ev);
		this.setState({createFormData})
	}

	handleSubmit = () => {
		const {createFormData} = this.state;
		this.setState({createFormData});
		this.props.createPartner(createFormData, (v) => {
			this.setState({process: v.loaded / v.total * 100})
		}, () => {
			console.log()
		}).then((d) => {
			if (d.payload.data.status === true){
				this.setState({createFormData: {}, coords: [], branches: [{}]});
			}
		})
	}

	render() {
		const {partnerCreateErr, allUsers, allCountries, allCities, allDrivers, partnerCreateStatus} = this.props;
		const {createFormData, coords, branches, process, s} = this.state;

		return (<Wrapper showFooter={ false }>
			<div className="container">
				<div className="add__content">
					<div className="user__header">
						<h3 className="users__title">Add Partner</h3>
						<NavLink to={ '/partners' } title="Close"><Close/></NavLink>
					</div>
					<div className="country__filter_area">
						<div className="country__update_content">
							<label className='country__update_label'>
								<p>Name</p><br/>
								<Input
									size='small'
									type={ "text" }
									value={ createFormData.name }
									className="driver__filter_label"
									errors={ partnerCreateErr.name ? partnerCreateErr.name : null }
									placeholder={ "Name" }
									title={ createFormData.name }
									onChange={ (event) => this.handleChange('name', event.target.value) }
								/>
							</label>
							<br/>
							<div className='country__update_label'>
								<p>Upload image</p>{ process && +process !== 100 && _.isEmpty(partnerCreateErr) ?
								<p style={ {color: 'forestgreen'} }>{ process }%</p> : null }
								<br/>
								<FileInput accept="image/*"
								           onClick={ () => this.handleChange('image', '') }
								           onChange={ (ev, files) => this.handleChange('image', files[0]) }/>
								{ partnerCreateErr.image ? <p className="err">{ partnerCreateErr.image }</p> : null }
							</div>
							<br/>
							<label className='country__update_label'>
								<p>User</p><br/>
								<SearchSelect
									data={ [{value: '', label: '- Choose User -'}, ..._.map(allUsers?.array || [], (v) => ({
										value: v.id,
										label: `${ v.id }) ${ v.firstName || 'No firstname' } ${ v.lastName || 'No lastname' } | ${ v.phoneNumber || 'No phone' } | ${ v.username || 'No username' }`,
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
									errors={ partnerCreateErr.user ? partnerCreateErr.user.replaceAll('_', ' ') : null }
								/>
							</label>
							<div className="dfa">Add Partner Branch &ensp;
								<FontAwesomeIcon icon={ faPlusSquare } className="add__service_button"
								                 onClick={ () => this.addDetail() }/>
							</div>
							<br/>
							<div className="dfj">
								{ _.map(branches, (v, k) => (<div className="service_details" key={ k }>
									<span className="close_details" onClick={ () => this.handleCloseDetail(k) }><Close/></span>
									<label className='country__update_label'>
										<p>Address</p><br/>
										<Input
											size={ 'small' }
											type={ "text" }
											value={ v.address ? v.address : '' }
											className="service__details_input"
											errors={ partnerCreateErr.address ? partnerCreateErr.address : partnerCreateErr[`branch.${ k }.address`] ? partnerCreateErr[`branch.${ k }.address`] : null }
											placeholder={ "Address" }
											title={ v.address }
											onChange={ (event) => this.handleChangeBranches('address', event.target.value, k) }
										/>
									</label>
									<label className="country__update_label">
										<h5>&ensp;Country</h5><br/>
										<SearchSelect
											data={ [{
												value: '', label: '- Choose Country -'
											}, ..._.map(allCountries?.array || [], (v) => ({
												value: v.id, label: `${ v.id }) ${ v.name || 'No name' }`,
											}))] }
											name="Country"
											onFocus={ () => this.props.getCountries(1) }
											onScrollTop={ () => {
												if (allCountries?.currentPage > 1){
													this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage - 1 : 1, void 0, void 0, void 0, s)
												}
											} }
											onScroll={ () => {
												if (allCountries?.currentPage < allCountries?.totalPages){
													this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage + 1 : 1, void 0, void 0, void 0, s)
												}
											} }
											onInputChange={ (event) => this.handleSearchSelect('country', event) }
											onChange={ (event) => this.handleChangeBranches('country', event?.value, k) }
											value={ v.country ? v.country : '' }
											errors={ partnerCreateErr[`branch.${ k }.country`] ? partnerCreateErr[`branch.${ k }.country`].replaceAll('_', ' ') : null }
										/>
									</label>
									<label className="country__update_label">
										<h5>&ensp;City</h5><br/>
										<SearchSelect
											data={ [{value: '', label: '- Choose City -'}, ..._.map(allCities?.array || [], (v) => ({
												value: v.id, label: `${ v.id }) ${ v.name || 'No name' }`,
											}))] }
											name="City"
											onFocus={ () => this.props.getCities(1) }
											onScrollTop={ () => {
												if (allCities?.currentPage > 1){
													this.props.getCities(allCities?.currentPage ? allCities?.currentPage - 1 : 1, void 0, void 0, void 0, s)
												}
											} }
											onScroll={ () => {
												if (allCities?.currentPage < allCities?.totalPages){
													this.props.getCities(allCities?.currentPage ? allCities?.currentPage + 1 : 1, void 0, void 0, void 0, s)
												}
											} }
											onInputChange={ (event) => this.handleSearchSelect('city', event) }
											onChange={ (event) => this.handleChangeBranches('city', event?.value, k) }
											value={ v.city ? v.city : '' }
											errors={ partnerCreateErr[`branch.${ k }.city`] ? partnerCreateErr[`branch.${ k }.city`].replaceAll('_', ' ') : null }
										/>
									</label>
									<label className='country__update_label'>
										<Switcher
											label={ "Is General" }
											checked={ v.isGeneral ? v.isGeneral === 'true' || v.isGeneral === true : false }
											onChange={ (event) => this.handleChangeBranches('isGeneral', event.target.checked, k) }
										/>
									</label>
									<div className='country__update_label'>
										<p>Coords</p><br/>
										<ModalButton
											title={ "Add location" }
											label={ "Add Location" }
											className={ 'w100' }
											cl={ 'log_out' }
											div={ <div className="center ticket_location">{ v.coords ?
												<p>Lat - { v.coords?.[0] }<br/>Lon - { v.coords?.[1] }</p> : '-' }</div> }
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
															error={ partnerCreateErr[`branch.${ k }.coords`] ? partnerCreateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
														/>
													</label>&ensp;
													<label className='coords__update_label'>
														<p>Longitude</p><br/>
														<Input
															size={ 'small' }
															value={ coords && coords[1] ? coords[1] : '' }
															onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
															placeholder="Longitude"
															error={ partnerCreateErr[`branch.${ k }.coords`] ? partnerCreateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
														/>
													</label>&ensp;
													<div className='coords__update_label'>
														<Button onClick={ () => this.handleSubmitCoords('coords', k) }
														        className={ "add__user" }
														        variant="contained" title="Save">
															Save
														</Button>
													</div>
												</div>
												<YMap onClick={ (ev) => this.onMapClick(ev, 'coords', k) }
												      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), "coords", k) }
												      coords={ !_.isEmpty(v.coords) ? v.coords : [] }
												      state={ !_.isEmpty(v.coords) ? v.coords : [] }
												/>
												<br/>
												<p className="err">
													{ partnerCreateErr[`branch.${ k }.coords`] ? partnerCreateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
												</p>
											</div> }
										/>
										<p className="err">
											{ partnerCreateErr[`branch.${ k }.coords`] ? partnerCreateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
										</p>
									</div>
									<div className="country__update_label" style={ {maxWidth: '240px'} }>
										<p>Drivers</p><br/>
										<SearchSelect
											data={ [{value: '', label: '- Choose Driver -'}, ..._.map(allDrivers?.array || [], (v) => ({
												value: v.id,
												label: `${ v.id }) ${ v.driverUser.firstName || 'No firstname' } ${ v.driverUser.lastName || 'No lastname' } | ${ v.driverUser.phoneNumber || 'No phone' } | ${ v.driverUser.username || 'No username' }`,
											}))] }
											name="Driver"
											onFocus={ () => this.props.getSelectDrivers(1, void 0, true) }
											onScrollTop={ () => {
												if (allDrivers?.currentPage > 1){
													this.props.getSelectDrivers(allDrivers?.currentPage ? allDrivers?.currentPage - 1 : 1, s, true)
												}
											} }
											onScroll={ () => {
												if (allDrivers?.currentPage < allDrivers?.totalPages){
													this.props.getSelectDrivers(allDrivers?.currentPage ? allDrivers?.currentPage + 1 : 1, s, true)
												}
											} }
											onInputChange={ (event) => this.handleSearchSelect('driver', event) }
											onChange={ (event) => this.handleChangeBranches('drivers', event?.value, k) }
											errors={ partnerCreateErr[`branch.${ k }.drivers`] ? partnerCreateErr[`branch.${ k }.drivers`].replaceAll('_', ' ') : null }
										/>
									</div>
									<div className="av_d_b" style={ {maxWidth: '240px'} }>
										{ _.map(branches[k]?.['drivers'], (i, j) => (v ? <div key={ j } className="availableDrivers">
											<span className="close_avd" onClick={ () => this.closeAvd(j, k) }><Close/></span>
											{ i })&ensp;
											{ _.find(allDrivers?.array || [], ['id', +i]).driverUser?.firstName || 'None' }&ensp;
											{ _.find(allDrivers?.array || [], ['id', +i]).driverUser?.lastName || 'None' }
										</div> : null)) }
									</div>
								</div>)) }
							</div>
							<br/>
							<label className='country__update_label'>
								<p>Delivery Price</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									value={ createFormData.deliveryPrice }
									className="driver__filter_label"
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ partnerCreateErr.deliveryPrice ? partnerCreateErr.deliveryPrice : null }
									placeholder={ "Delivery Price" }
									title={ createFormData.deliveryPrice }
									onChange={ (event) => this.handleChange('deliveryPrice', validateInput(event.target.value)) }
								/>
							</label>
							<label className='country__update_label'>
								<p>Membership Price</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									value={ createFormData.membershipPrice }
									className="driver__filter_label"
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ partnerCreateErr.membershipPrice ? partnerCreateErr.membershipPrice : null }
									placeholder={ "Membership Price" }
									title={ createFormData.membershipPrice }
									onChange={ (event) => this.handleChange('membershipPrice', validateInput(event.target.value)) }
								/>
							</label>
							<label className='country__update_label'>
								<p>Last Membership Payment</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									value={ createFormData.lastMembershipPayment }
									className="driver__filter_label"
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ partnerCreateErr.lastMembershipPayment ? partnerCreateErr.lastMembershipPayment : null }
									placeholder={ "Last Membership Payment" }
									title={ createFormData.lastMembershipPayment }
									onChange={ (event) => this.handleChange('lastMembershipPayment', validateInput(event.target.value)) }
								/>
							</label>
							<label className='country__update_label'>
								<p>Next Membership Payment</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									value={ createFormData.nextMembershipPayment }
									className="driver__filter_label"
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ partnerCreateErr.nextMembershipPayment ? partnerCreateErr.nextMembershipPayment : null }
									placeholder={ "Next Membership Payment" }
									title={ createFormData.nextMembershipPayment }
									onChange={ (event) => this.handleChange('nextMembershipPayment', validateInput(event.target.value)) }
								/>
							</label>
							<label className='country__update_label'>
								<p>Intermediate Route Price</p><br/>
								<Input
									size={ 'small' }
									type={ "number" }
									value={ createFormData.routePrice }
									className="driver__filter_label"
									inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
									errors={ partnerCreateErr.routePrice ? partnerCreateErr.routePrice : null }
									placeholder={ "Route Price" }
									title={ createFormData.routePrice }
									onChange={ (event) => this.handleChange('routePrice', validateInput(event.target.value)) }
								/>
							</label>
							<label className='country__update_label'>
								<p>Intermediate Route</p><br/>
								<div className="dfc w100">
									<ModalButton
										title={ "Add Route" }
										label={ "Add Route" }
										className={ 'w100' }
										w={ 'delivery_location_left' }
										cl={ 'log_out' }
										div={ <div className="delivery_location"><AddLocation/></div> }
										c={ true }
										input={ <div className="user__create_content">
											<RouteMap onChange={ (ev) => this.handleChange('routes', ev.get('newBounds')) }/>
											<br/>
											<p className="err">
												{ partnerCreateErr[`routes`] ? partnerCreateErr[`routes`].replaceAll('_', ' ') : null }
											</p>
										</div> }
									/>
									<div className="delivery_location_middle delivery_location">
										{ createFormData.routes ? <p>A - { createFormData.routes?.[0]?.join(' - ') }<br/>
											B - { createFormData.routes?.[1].join(' - ') }</p> : '-' }
									</div>
									<div className="delivery_location_right delivery_location"
									     onClick={ () => this.handleChange('routes', void 0) }><Close/>
									</div>
								</div>
								<p className="err">
									{ partnerCreateErr[`routes`] ? partnerCreateErr[`routes`].replaceAll('_', ' ') : null }
								</p>
							</label>
						</div>
						<div className="update__buttons_row">
							<NavLink to='/partners'>
								<Button title="Cancel" className="add__user" variant="contained">
									Cancel
								</Button>
							</NavLink>
							<Button onClick={ this.handleSubmit } className={ partnerCreateStatus === 'request' ? "" : "add__user" }
							        disabled={ partnerCreateStatus === 'request' }
							        variant="contained" title="Save">
								{ partnerCreateStatus === 'request' ? 'Wait...' : 'Submit' }
							</Button>
						</div>
					</div>
				</div>
				<Results/>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	partnerCreate: state.users.partnerCreate,
	partnerCreateErr: state.users.partnerCreateErr,
	partnerCreateStatus: state.users.partnerCreateStatus,
	allUsers: state.users.allUsers,
	allDrivers: state.users.allDrivers,
	allCountries: state.location.allCountries,
	allCities: state.location.allCities,
})

const mapDispatchToProps = {
	createPartner, getCountries, getCities, getSelectUsers, getSelectDrivers,
}

const AddPartnerContainer = connect(mapStateToProps, mapDispatchToProps,)(AddPartner)

export default AddPartnerContainer;
