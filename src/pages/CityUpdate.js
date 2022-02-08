import React, { Component } from 'react';
import _ from "lodash";
import { Close } from "@material-ui/icons";
import { Button } from "@mui/material";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import ModalButton from "../components/modals/modal";
import Results from "../components/utils/Results";
import { NavLink } from "react-router-dom";
import YMap from "../components/map/ymap";
import { deletingCity, getCities, getCountries, getOneCity, updateCity } from "../store/actions/admin/location";
import Input from "../components/form/Input";
import InputRadio from "../components/form/Radio";
import ErrorEnum from "../helpers/ErrorHandler";
import SearchSelect from "../components/form/SelectSearch";

class CityUpdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.page,
			coords: [],
			updateFormData: {},
		};
		this.input = React.createRef();
	}

	componentDidMount() {
		const {id} = this.state;
		this.props.getOneCity(id);
		this.props.getCities();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {id} = this.props.match.params.page;
		if (prevState.id !== id){
			this.setState({id});
		}
		if (prevState.updateFormData !== this.state.updateFormData){
			return this.state.updateFormData;
		}
		if (prevProps.cityUpdate !== this.props.cityUpdate){
			return this.props.cityUpdate;
		}
	}

	handleSearchSelect = (path, ev) => {
		if (path === 's'){
			this.props.getCountries(1, void 0, void 0, void 0, ev);
		}
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
		this.props.updateCity(updateFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getOneCity(ev);
				this.setState({updateFormData: {}});
			}
		})
	}

	onSuggestSelect = (e) => {
		const name = e.get("item").value;
		const {updateFormData} = this.state;
		_.set(updateFormData, 'name', _.trim(name));
		this.setState({updateFormData});
	};

	onMapClick = (ev) => {
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		const {updateFormData} = this.state;
		_.set(updateFormData, "coords", coords);
		this.setState({updateFormData, coords});
	}

	handleChangeCoords = (path, ev) => {
		const {coords} = this.state;
		const {city} = this.props;
		if (path === "lat"){
			coords[0] = ev;
			if (!coords[1]){
				coords[1] = city.coords && city.coords[1] ? city.coords[1] : ''
			}
		}
		if (path === "lon"){
			coords[1] = ev;
			if (!coords[0]){
				coords[0] = city.coords && city.coords[0] ? city.coords[0] : ''
			}
		}
		this.setState({coords})
	}

	handleSubmitCoords = () => {
		const {updateFormData, coords} = this.state;
		_.set(updateFormData, "coords", coords);
		this.setState({updateFormData});
	}

	render() {
		const {cityUpdate, cityUpdateErr, city, cityStatus, allCountries, cityUpdateStatus} = this.props;
		const {coords, updateFormData} = this.state;

		return (
			<Wrapper showFooter={ false }>
				<div className="container">
					{ cityStatus === "success" && city ?
						<div className="add__content">
							<div className="user__header">
								<h3 className="users__title">City Update</h3>
								<NavLink to={ '/city' } title="Close"><Close/></NavLink>
							</div>
							<div className="country__filter_area">
								<div className="country__update_content">
									<label className="user__create_label">
										<p>Country</p><br/>
										<SearchSelect
											data={ [{value: '', label: '- Choose Country -'}, ..._.map(allCountries.array, (v) => ({
												value: v.id,
												label: `${ v.id }) ${ v.name || 'No name' }`,
											}))] }
											name="Country"
											onFocus={ () => this.props.getCountries(1) }
											onScrollTop={ () => {
												if (allCountries?.currentPage > 1){
													this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage - 1 : 1)
												}
											} }
											onScroll={ () => {
												if (allCountries?.currentPage < allCountries?.totalPages){
													this.props.getCountries(allCountries?.currentPage ? allCountries?.currentPage + 1 : 1)
												}
											} }
											onInputChange={ (event) => this.handleSearchSelect('s', event) }
											onChange={ (event) => this.handleChange('countryId', event?.value) }
											value={ city?.country ? {
												value: city?.country?.id,
												label: `${ city?.country?.id }) ${ city?.country?.name }`
											} : '' }
											errors={ cityUpdateErr.countryId ? cityUpdateErr.countryId.replaceAll('_', ' ') : null }
										/>
									</label>
									<br/>
									<label className='country__update_label'>
										<p>City Name</p><br/>
										<input ref={ this.input }
										       className={ `country__create_input` }
										       style={ {
											       border: updateFormData.name && updateFormData.name !== city?.name
												       ? '2px solid black' : null
										       } }
										       value={ updateFormData.name ? updateFormData.name : updateFormData.name === "" ? "" : city?.name || '' }
										       onChange={ (ev) => this.handleChange('name', ev.target.value) }
										       placeholder="City Name"
										/>
										<p className="err">
											{ cityUpdateErr.name ? ErrorEnum[cityUpdateErr.name] ? ErrorEnum[cityUpdateErr.name]
												: cityUpdateErr.name.replaceAll('_', ' ') : null }<br/>
											{ cityUpdate?.status === false ? ErrorEnum[cityUpdate?.message] ? ErrorEnum[cityUpdate?.message]
												: cityUpdate?.message.replaceAll('_', ' ') : null }
										</p>
									</label>
									<br/>
									<div className="country__update_label">
										<InputRadio
											label={ 'User Take' }
											first={ 'Yes' }
											second={ 'No' }
											firstValue={ true }
											secondValue={ false }
											value={ updateFormData.isCanTakePassengers ? updateFormData.isCanTakePassengers.toString() === 'true'
												: city?.isCanTakePassengers ? city.isCanTakePassengers : city?.isCanTakePassengers !== false }
											onChange={ (event) => this.handleChange('isCanTakePassengers', event.target.value) }
										/>
									</div>
									<div className="update__latLon_row">
										<label className='coords__update_label'>
											<p>Latitude</p><br/>
											<Input
												size={ 'small' }
												className={ coords && coords[0] ? 'in_border' : null }
												value={ coords?.[0] || undefined }
												onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
												placeholder="Latitude"
												error={ cityUpdateErr.coords ? cityUpdateErr.coords.replaceAll('_', ' ') : null }
												defaultValue={ coords?.[0] ? undefined : city?.coords?.[0] }
											/>
										</label>
										<label className='coords__update_label'>
											<p>Longitude</p><br/>
											<Input
												size={ 'small' }
												className={ coords && coords[1] ? 'in_border' : null }
												value={ coords?.[1] || undefined }
												onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
												placeholder="Longitude"
												error={ cityUpdateErr.coords ? cityUpdateErr.coords.replaceAll('_', ' ') : null }
												defaultValue={ coords?.[1] ? undefined : city?.coords?.[1] }
											/>
										</label>
										<div className='coords__update_label'>
											<Button onClick={ () => this.handleSubmitCoords() } title="Save"
											        variant="contained" className={ "add__user" }>Save</Button>
										</div>
									</div>
									<div className="country__update_label">
										<YMap coords={ !_.isEmpty(coords) ? coords : city?.coords }
										      state={ !_.isEmpty(coords) ? coords : city?.coords }
										      onClick={ this.onMapClick } input={ this.input }
										      s={ (ev) => this.onMapClick(ev.get('target').getCenter()) }
										      onSuggestSelect={ this.onSuggestSelect }/>
										<br/>
										<p className="err">
											{ cityUpdateErr.coords ? ErrorEnum[cityUpdateErr.coords] ? ErrorEnum[cityUpdateErr.coords]
												: cityUpdateErr.coords.replaceAll('_', ' ') : null }</p>
									</div>
								</div>
								<div className="update__buttons_row">
									<ModalButton
										title={ "Delete" }
										label={ "Delete City" }
										className={ "add__user" }
										cl={ 'log_out' }
										text={ "Are you sure you want to delete city?" }
										button={ "Delete City" }
										enter={ "Yes" }
										onClick={ () => this.props.deletingCity(city?.id).then(() => {
											this.props.getCities();
											this.props.history.push('/city');
										}) }
									/>
									<Button onClick={ () => this.handleSubmit(city?.id) }
									        className={ _.isEmpty(updateFormData) || cityUpdateStatus === "request" ? "" : "add__user" }
									        disabled={ _.isEmpty(updateFormData) || cityUpdateStatus === "request" }
									        variant="contained" title="Save">
										{ cityUpdateStatus === 'request' ? 'Wait...' : 'Save' }
									</Button>
								</div>
							</div>
						</div>
						: <><br/><p className="center">{ city ? "loading..." : "No such city" }</p></> }
					<Results/>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	city: state.location.city,
	allCountries: state.location.allCountries,
	cityStatus: state.location.cityStatus,
	cityUpdate: state.location.cityUpdate,
	cityUpdateErr: state.location.cityUpdateErr,
	cityUpdateStatus: state.location.cityUpdateStatus,
})

const mapDispatchToProps = {
	getCities,
	getCountries,
	getOneCity,
	updateCity,
	deletingCity,
}

const CityUpdateContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(CityUpdate)

export default CityUpdateContainer;
