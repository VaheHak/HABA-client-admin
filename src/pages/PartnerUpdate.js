import React, { Component } from 'react';
import _ from "lodash";
import { AddLocation, Close } from "@material-ui/icons";
import { Button } from "@mui/material";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import {
	deletingPartner,
	getOnePartner,
	getSelectDrivers,
	getSelectUsers,
	updatePartner
} from "../store/actions/admin/users";
import Input from "../components/form/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import ModalButton from "../components/modals/modal";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation";
import { getCities, getCountries } from "../store/actions/admin/location";
import Switcher from "../components/form/Switch";
import YMap from "../components/map/ymap";
import FileEdit from "../components/form/FileEdit";
import RouteMap from "../components/map/RouteMap";

class PartnerUpdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.page,
			updateFormData: {},
			coords: [],
			branches: [],
			process: '',
			s: '',
		};
	}

	componentDidMount() {
		const {id} = this.state;
		this.props.getOnePartner(id);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const id = this.props.match.params.page;
		const {partner} = this.props;
		if (prevState.id !== id){
			this.setState({id});
		}
		if (prevState.updateFormData !== this.state.updateFormData){
			return this.state.updateFormData;
		}
		if (prevProps.partnerUpdate !== this.props.partnerUpdate){
			return this.props.partnerUpdate;
		}
		if (partner && prevState.branches !== partner.partnerBranches){
			this.setState({branches: partner?.partnerBranches});
		}
	}

	handleSearchSelect = (path, ev) => {
		if (path === 'user'){
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
		const {branches, updateFormData} = this.state;
		branches.splice(i, 1);
		this.setState({
			branches,
			updateFormData: {...updateFormData, branches},
		});
	}
	handleDeleteDetail = (ev) => {
		const {updateFormData, id} = this.state;
		_.set(updateFormData, "deleteBranchId", ev);
		_.set(updateFormData, "id", id);
		this.props.updatePartner(updateFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getOnePartner(id);
			}
		})
	}
	handleChangeDetails = (path, ev, k) => {
		const {branches, updateFormData} = this.state;
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
		_.set(updateFormData, "branches", branches);
		this.setState({branches, updateFormData})
	}

	deleteAvDriver = (i, bId) => {
		const {updateFormData, id} = this.state;
		_.set(updateFormData, 'id', id);
		_.set(updateFormData, 'branchId', bId);
		_.set(updateFormData, 'delDriverId', i);
		this.props.updatePartner(updateFormData).then(async (d) => {
			if (d.payload.data.status === true){
				await this.props.getOnePartner(id);
				_.set(updateFormData, 'branchId', void 0);
				_.set(updateFormData, 'delDriverId', void 0);
				this.setState({updateFormData});
			}
		});
	}

	closeAvd = (i, k) => {
		const {branches, updateFormData} = this.state;
		branches[k]?.['drivers'].splice(i, 1);
		_.set(branches[k], 'drivers', _.uniq(branches[k]?.['drivers']));
		_.set(updateFormData, "branches", branches);
		this.setState({updateFormData});
	}

	onMapClick = (ev, path, k) => {
		const {updateFormData, branches} = this.state;
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		_.set(branches[k], path, coords);
		_.set(updateFormData, "branches", branches);
		this.setState({branches, coords, updateFormData});
	}

	handleChangeCoords = (path, ev, k) => {
		const {coords, branches} = this.state;
		if (path === "lat"){
			coords[0] = +ev;
			if (!coords[1]){
				coords[1] = branches?.[k]?.coords && branches?.[k]?.coords?.[1] ? branches?.[k]?.coords?.[1] : ''
			}
		}
		if (path === "lon"){
			coords[1] = +ev;
			if (!coords[0]){
				coords[0] = branches?.[k]?.coords && branches?.[k]?.coords?.[0] ? branches?.[k]?.coords?.[0] : ''
			}
		}
		this.setState({coords})
	}

	handleSubmitCoords = (path, k) => {
		const {updateFormData, branches, coords} = this.state;
		_.set(branches[k], path, coords ? coords : branches[k].coords ? branches[k].coords : []);
		_.set(updateFormData, "branches", branches);
		this.setState({updateFormData, branches, coords: []});
	}

	handleChange = (path, ev) => {
		const {updateFormData} = this.state;
		_.set(updateFormData, path, ev);
		this.setState({updateFormData})
	}

	handleSubmit = (ev) => {
		const {updateFormData} = this.state;
		_.set(updateFormData, "id", ev);
		this.setState({updateFormData});
		this.props.updatePartner(updateFormData, (v) => {
			this.setState({process: v.loaded / v.total * 100})
		}, () => {
			console.log()
		}).then((d) => {
			if (d.payload.data.status === true){
				this.props.getOnePartner(ev);
				this.setState({updateFormData: {}, coords: []});
			}
		})
	}

	render() {
		const {
			partnerUpdateErr, allUsers, allCountries, allCities, allDrivers,
			partner, partnersStatus, partnerUpdateStatus
		} = this.props;
		const {updateFormData, coords, branches, process, s} = this.state;

		return (
			<Wrapper showFooter={ false }>
				<div className="container">
					{ partnersStatus === 'success' && partner ?
						<div className="add__content">
							<div className="user__header">
								<h3 className="users__title">Edit Partner</h3>
								<NavLink to={ '/partners' } title="Close"><Close/></NavLink>
							</div>
							<div className="country__filter_area">
								<div className="country__update_content">
									<label className='country__update_label'>
										<p>Name</p><br/>
										<Input
											size='small'
											type={ "text" }
											value={ updateFormData.name }
											className="driver__filter_label"
											errors={ partnerUpdateErr.name ? partnerUpdateErr.name : null }
											placeholder={ "Name" }
											title={ updateFormData.name }
											defaultValue={ partner?.name }
											onChange={ (event) => this.handleChange('name', event.target.value) }
										/>
									</label>
									<br/>
									<div className='country__update_label'>
										<p>Edit image</p>{ process && +process !== 100 && _.isEmpty(partnerUpdateErr) ?
										<p style={ {color: 'forestgreen'} }>{ process }%</p> : null }
										<br/>
										<div className="change__image_block">
											<div className="change__image_item">
												<img
													onError={ ev => {
														ev.target.src = "/images/icons/avatar.jpg"
													} }
													className={ 'edit_image' }
													src={ updateFormData.image ? updateFormData.image.preview : partner.image ? partner.image : '/images/icons/avatar.jpg' }
													alt={ partner?.name }
												/>
												{ updateFormData.image ? <p title={ updateFormData.image.name }>
													{ _.truncate(updateFormData.image.name, {
														'length': 20,
														'separator': ''
													}) }</p> : null }
											</div>
											<div className="change__image_item">
												<FileEdit accept="image/*"
												          title={ 'Choose image' }
												          className={ 'imageEdit' }
												          onClick={ () => this.handleChange('image', '') }
												          onChange={ (ev, files) => this.handleChange('image', files[0]) }/>
											</div>
										</div>
										{ partnerUpdateErr.image ? <p className="err">{ partnerUpdateErr.image }</p> : null }
									</div>
									<br/>
									<label className='country__update_label'>
										<p>User</p><br/>
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
													this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage - 1 : 1, s)
												}
											} }
											onScroll={ () => {
												if (allUsers?.currentPage < allUsers?.totalPages){
													this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage + 1 : 1, s)
												}
											} }
											onInputChange={ (event) => this.handleSearchSelect('user', event) }
											onChange={ (event) => this.handleChange('user', event?.value) }
											value={ partner?.partnerUser ? {
												value: partner.partnerUser?.id,
												label: `${ partner.partnerUser?.id }) ${ partner.partnerUser?.firstName || 'No firstname' }
                         ${ partner.partnerUser?.lastName || 'No lastname' } | ${ partner.partnerUser?.phoneNumber
												|| 'No phone' } | ${ partner.partnerUser?.username || 'No username' }`,
											} : '' }
											errors={ partnerUpdateErr.user ? partnerUpdateErr.user.replaceAll('_', ' ') : null }
										/>
									</label>
									<div className="dfa">Add Partner Branch &ensp;
										<FontAwesomeIcon icon={ faPlusSquare } className="add__service_button"
										                 onClick={ () => this.addDetail() }
										/></div>
									<br/>
									<div className="dfj add__partner_branch">
										{ _.map(branches, (v, k) => (
											v ? <div className="service_details" key={ k }>
												{ v.id ? <span className="close_details" onClick={ () => {
														this.handleDeleteDetail(v.id);
														this.handleCloseDetail(k)
													} }><Close color="secondary"/></span> :
													<span className="close_details" onClick={ () => this.handleCloseDetail(k) }><Close/></span>
												}
												<label className='country__update_label'>
													<p>Address</p><br/>
													<Input
														size={ 'small' }
														type={ "text" }
														value={ v.address ? v.address : '' }
														className="service__details_input"
														errors={ partnerUpdateErr.address ? partnerUpdateErr.address :
															partnerUpdateErr[`branch.${ k }.address`] ? partnerUpdateErr[`branch.${ k }.address`] : null }
														placeholder={ "Address" }
														title={ v.address }
														onChange={ (event) => this.handleChangeDetails('address', event.target.value, k) }
													/>
												</label>
												<label className="country__update_label">
													<h5>&ensp;Country</h5><br/>
													<SearchSelect
														data={ [{
															value: '',
															label: '- Choose Country -'
														}, ..._.map(allCountries?.array || [], (v) => ({
															value: v.id,
															label: `${ v.id }) ${ v.name || 'No name' }`,
														}))] }
														name="Country"
														onFocus={ () => this.props.getCountries(1) }
														onScrollTop={ () => {
															if (allCountries?.currentPage > 1){
																this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage - 1 : 1,
																	void 0, void 0, void 0, s)
															}
														} }
														onScroll={ () => {
															if (allCountries?.currentPage < allCountries?.totalPages){
																this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage + 1 : 1,
																	void 0, void 0, void 0, s)
															}
														} }
														onInputChange={ (event) => this.handleSearchSelect('country', event) }
														onChange={ (event) => this.handleChangeDetails('country', event?.value, k) }
														value={ v?.branchCountry ? {
															value: v.branchCountry?.id,
															label: `${ v.branchCountry?.id }) ${ v.branchCountry?.name || 'No name' }`,
														} : '' }
														errors={ partnerUpdateErr[`branch.${ k }.country`] ? partnerUpdateErr[`branch.${ k }.country`].replaceAll('_', ' ') : null }
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
																	void 0, void 0, void 0, s)
															}
														} }
														onScroll={ () => {
															if (allCities?.currentPage < allCities?.totalPages){
																this.props.getCities(allCities?.currentPage ? allCities?.currentPage + 1 : 1,
																	void 0, void 0, void 0, s)
															}
														} }
														onInputChange={ (event) => this.handleSearchSelect('city', event) }
														onChange={ (event) => this.handleChangeDetails('city', event?.value, k) }
														value={ v?.branchCity ? {
															value: v.branchCity?.id,
															label: `${ v.branchCity?.id }) ${ v.branchCity?.name || 'No name' }`,
														} : '' }
														errors={ partnerUpdateErr[`branch.${ k }.city`] ? partnerUpdateErr[`branch.${ k }.city`].replaceAll('_', ' ') : null }
													/>
												</label>
												<label className='country__update_label'>
													<Switcher
														label={ "Is General" }
														checked={ v.isGeneral ? v.isGeneral === 'true' || v.isGeneral === true : false }
														onChange={ (event) => this.handleChangeDetails('isGeneral', event.target.checked, k) }
													/>
												</label>
												<div className='country__update_label' style={ {maxWidth: '300px'} }>
													<p>Coords</p><br/>
													<ModalButton
														title={ "Doubleclick to add location" }
														label={ "Add Location" }
														className={ 'w100' }
														cl={ 'log_out' }
														db={ true }
														div={ <div className="center ticket_location">{ v.coords ?
															<p>Lat - { v.coords?.[0] }<br/>Lon - { v.coords?.[1] }</p> : '-' }</div> }
														c={ true }
														input={
															<div className="user__create_content">
																<div className="update__latLon_row">
																	<label className='coords__update_label'>
																		<p>Latitude</p><br/>
																		<Input
																			size={ 'small' }
																			value={ coords && coords[0] ? coords[0] : coords?.[0] === '' ? '' : v.coords?.[0] ? v.coords?.[0] : '' }
																			onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value, k) }
																			placeholder="Latitude"
																			error={ partnerUpdateErr[`branch.${ k }.coords`] ? partnerUpdateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
																		/>
																	</label>&ensp;
																	<label className='coords__update_label'>
																		<p>Longitude</p><br/>
																		<Input
																			size={ 'small' }
																			value={ coords && coords[1] ? coords[1] : coords?.[1] === '' ? '' : v.coords?.[1] ? v.coords?.[1] : '' }
																			onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value, k) }
																			placeholder="Longitude"
																			error={ partnerUpdateErr[`branch.${ k }.coords`] ? partnerUpdateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
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
																      s={ (ev) => this.onMapClick(ev.get('target').getCenter(), 'coords', k) }
																      coords={ !_.isEmpty(v.coords) ? v.coords : [] }
																      state={ !_.isEmpty(v.coords) ? v.coords : [] }
																/>
																<br/>
																<p className="err">
																	{ partnerUpdateErr[`branch.${ k }.coords`] ? partnerUpdateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
																</p>
															</div>
														}
													/>
													<p className="err">
														{ partnerUpdateErr[`branch.${ k }.coords`] ? partnerUpdateErr[`branch.${ k }.coords`].replaceAll('_', ' ') : null }
													</p>
												</div>
												<div className="country__update_label" style={ {maxWidth: '250px'} }>
													<p>Drivers</p><br/>
													<SearchSelect
														data={ [{value: '', label: '- Choose Driver -'}, ..._.map(allDrivers?.array || [], (v) => ({
															value: v.id,
															label: `${ v.id }) ${ v.driverUser.firstName || 'No firstname' } ${ v.driverUser.lastName ||
															'No lastname' } | ${ v.driverUser.phoneNumber || 'No phone' } | ${ v.driverUser.username || 'No username' }`,
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
														onChange={ (event) => this.handleChangeDetails('drivers', event?.value, k) }
														errors={ partnerUpdateErr[`branch.${ k }.drivers`] ? partnerUpdateErr[`branch.${ k }.drivers`].replaceAll('_', ' ') : null }
													/>
												</div>
												<div className="av_d_b" style={ {maxWidth: '250px'} }>
													{ _.map(v.driverPartnerBranches || [], (r, k) => (
														r ? <div key={ k } className="availableDrivers">
                            <span className="close_avd err" style={ {borderColor: "red"} } title="Delete"
                                  onClick={ () => this.deleteAvDriver(r?.id, v.id) }><Close/></span>
															{ r.id })&ensp;
															{ r?.driverUser?.firstName || 'None' }&ensp;
															{ r?.driverUser?.lastName || 'None' }
														</div> : null
													)) }
													{ _.map(branches[k]?.['drivers'], (v, j) => (
														v ? <div key={ j } className="availableDrivers">
															<span className="close_avd" onClick={ () => this.closeAvd(j, k) }><Close/></span>
															{ v })&ensp;
															{ _.find(allDrivers?.array || [], ['id', +v])?.driverUser?.firstName || 'None' }&ensp;
															{ _.find(allDrivers?.array || [], ['id', +v])?.driverUser?.lastName || 'None' }
														</div> : null
													)) }
												</div>
											</div> : null
										)) }
									</div>
									<br/>
									<label className='country__update_label'>
										<p>Delivery Price</p><br/>
										<Input
											size={ 'small' }
											type={ "number" }
											value={ updateFormData.deliveryPrice }
											defaultValue={ partner?.deliveryPrice }
											className={ `driver__filter_label ${ updateFormData.deliveryPrice
											&& +updateFormData.deliveryPrice !== +partner?.deliveryPrice ? 'in_border' : null }` }
											inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
											errors={ partnerUpdateErr.deliveryPrice ? partnerUpdateErr.deliveryPrice : null }
											placeholder={ "Delivery Price" }
											title={ updateFormData.deliveryPrice }
											onChange={ (event) => this.handleChange('deliveryPrice', validateInput(event.target.value)) }
										/>
									</label>
									<label className='country__update_label'>
										<p>Membership Price</p><br/>
										<Input
											size={ 'small' }
											type={ "number" }
											value={ updateFormData.membershipPrice }
											defaultValue={ partner?.membershipPrice }
											className={ `driver__filter_label ${ updateFormData.membershipPrice
											&& +updateFormData.membershipPrice !== +partner?.membershipPrice ? 'in_border' : null }` }
											inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
											errors={ partnerUpdateErr.membershipPrice ? partnerUpdateErr.membershipPrice : null }
											placeholder={ "Membership Price" }
											title={ updateFormData.membershipPrice }
											onChange={ (event) => this.handleChange('membershipPrice', validateInput(event.target.value)) }
										/>
									</label>
									<label className='country__update_label'>
										<p>Last Membership Payment</p><br/>
										<Input
											size={ 'small' }
											type={ "number" }
											value={ updateFormData.lastMembershipPayment }
											defaultValue={ partner?.lastMembershipPayment }
											className={ `driver__filter_label ${ updateFormData.lastMembershipPayment
											&& +updateFormData.lastMembershipPayment !== +partner?.lastMembershipPayment ? 'in_border' : null }` }
											inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
											errors={ partnerUpdateErr.lastMembershipPayment ? partnerUpdateErr.lastMembershipPayment : null }
											placeholder={ "Last Membership Payment" }
											title={ updateFormData.lastMembershipPayment }
											onChange={ (event) => this.handleChange('lastMembershipPayment', validateInput(event.target.value)) }
										/>
									</label>
									<label className='country__update_label'>
										<p>Next Membership Payment</p><br/>
										<Input
											size={ 'small' }
											type={ "number" }
											value={ updateFormData.nextMembershipPayment }
											defaultValue={ partner?.nextMembershipPayment }
											className={ `driver__filter_label ${ updateFormData.nextMembershipPayment
											&& +updateFormData.nextMembershipPayment !== +partner?.nextMembershipPayment ? 'in_border' : null }` }
											inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
											errors={ partnerUpdateErr.nextMembershipPayment ? partnerUpdateErr.nextMembershipPayment : null }
											placeholder={ "Next Membership Payment" }
											title={ updateFormData.nextMembershipPayment }
											onChange={ (event) => this.handleChange('nextMembershipPayment', validateInput(event.target.value)) }
										/>
									</label>
									<label className='country__update_label'>
										<p>Intermediate Route Price</p><br/>
										<Input
											size={ 'small' }
											type={ "number" }
											value={ updateFormData.routePrice }
											defaultValue={ partner?.routePrice }
											className="driver__filter_label"
											inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
											errors={ partnerUpdateErr.routePrice ? partnerUpdateErr.routePrice : null }
											placeholder={ "Route Price" }
											title={ updateFormData.routePrice }
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
													<RouteMap onChange={ (ev) => this.handleChange('routes', ev.get('newBounds')) }
													          coordinates={ partner?.routes }/>
													<br/>
													<p className="err">
														{ partnerUpdateErr[`routes`] ? partnerUpdateErr[`routes`].replaceAll('_', ' ') : null }
													</p>
												</div> }
											/>
											<div className="delivery_location_middle delivery_location">
												{ updateFormData.routes ? <p>A - { updateFormData.routes?.[0]?.join(' - ') }<br/>
														B - { updateFormData.routes?.[1].join(' - ') }</p> :
													partner?.routes ? <p>A - { partner?.routes?.[0]?.join(' - ') }<br/>
														B - { partner?.routes?.[1].join(' - ') }</p> : '-' }
											</div>
											<div className="delivery_location_right delivery_location"
											     onClick={ () => this.handleChange('routes', void 0) }><Close/>
											</div>
										</div>
										<p className="err">
											{ partnerUpdateErr[`routes`] ? partnerUpdateErr[`routes`].replaceAll('_', ' ') : null }
										</p>
									</label>
								</div>
								<div className="update__buttons_row">
									<ModalButton
										title={ "Delete partner" }
										label={ "Delete partner" }
										className={ "add__user" }
										cl={ 'log_out' }
										text={ "Are you sure you want to delete partner?" }
										button={ "Delete" }
										enter={ "Yes" }
										onClick={ () => this.props.deletingPartner(partner?.id).then((d) => {
											if (d.payload.data.status === true){
												this.props.getOnePartner(partner?.id);
												this.props.history.push('/partners');
											}
										}) }
									/>
									<Button onClick={ () => this.handleSubmit(partner?.id) }
									        className={ _.isEmpty(updateFormData) || partnerUpdateStatus === "request" ? "" : "add__user" }
									        disabled={ _.isEmpty(updateFormData) || partnerUpdateStatus === "request" }
									        variant="contained" title="Save">
										{ partnerUpdateStatus === 'request' ? 'Wait...' : 'Save' }
									</Button>
								</div>
							</div>
						</div>
						: <><br/><p className="center">{ partner ? 'loading...' : 'No such partner' }</p></> }
					<Results/>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	partner: state.users.partner,
	partnersStatus: state.users.partnersStatus,
	partnerUpdate: state.users.partnerUpdate,
	partnerUpdateErr: state.users.partnerUpdateErr,
	partnerUpdateStatus: state.users.partnerUpdateStatus,
	allUsers: state.users.allUsers,
	allDrivers: state.users.allDrivers,
	allCountries: state.location.allCountries,
	allCities: state.location.allCities,
})

const mapDispatchToProps = {
	getOnePartner,
	updatePartner,
	deletingPartner,
	getCountries,
	getCities,
	getSelectUsers,
	getSelectDrivers,
}

const PartnerUpdateContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(PartnerUpdate)

export default PartnerUpdateContainer;
