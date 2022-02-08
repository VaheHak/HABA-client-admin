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
import { deletingCountry, getCountries, getCountry, updateCountry } from "../store/actions/admin/location";
import Input from "../components/form/Input";
import ErrorEnum from "../helpers/ErrorHandler";

class CountryUpdate extends Component {
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
		this.props.getCountry(id);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {id} = this.props.match.params.page;
		if (prevState.id !== id){
			this.setState({id});
		}
		if (prevState.updateFormData !== this.state.updateFormData){
			return this.state.updateFormData;
		}
		if (prevProps.countryUpdate !== this.props.countryUpdate){
			return this.props.countryUpdate;
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
		this.props.updateCountry(updateFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getCountry(ev);
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
		const {country} = this.props;
		if (path === "lat"){
			coords[0] = ev;
			if (!coords[1]){
				coords[1] = country.coords && country.coords[1] ? country.coords[1] : ''
			}
		}
		if (path === "lon"){
			coords[1] = ev;
			if (!coords[0]){
				coords[0] = country.coords && country.coords[0] ? country.coords[0] : ''
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
		const {countryUpdate, countryUpdateErr, country, countryStatus, countryUpdateStatus} = this.props;
		const {coords, updateFormData} = this.state;

		return (
			<Wrapper showFooter={ false }>
				<div className="container">
					{ countryStatus === "success" && country ?
						<div className="add__content">
							<div className="user__header">
								<h3 className="users__title">Country Update</h3>
								<NavLink to={ '/countries' } title="Close"><Close/></NavLink>
							</div>
							<div className="country__filter_area">
								<div className="country__update_content">
									<label className='country__update_label'>
										<p>Country Name</p><br/>
										<input ref={ this.input }
										       style={ {
											       border: updateFormData.name && updateFormData.name !== country?.name
												       ? '2px solid black' : null
										       } }
										       value={ updateFormData.name ? updateFormData.name : updateFormData.name === "" ? "" : country?.name }
										       onChange={ (ev) => this.handleChange('name', ev.target.value) }
										       placeholder="Country Name"
										       className='country__create_input'/>
										<p className="err">
											{ countryUpdateErr.name ? ErrorEnum[countryUpdateErr.name] ? ErrorEnum[countryUpdateErr.name]
												: countryUpdateErr.name.replaceAll('_', ' ') : null }<br/>
											{ countryUpdate?.status === false ? ErrorEnum[countryUpdate?.message] ? ErrorEnum[countryUpdate?.message]
												: countryUpdate?.message.replaceAll('_', ' ') : null }
										</p>
									</label>
									<br/>
									<div className="update__latLon_row">
										<label className='coords__update_label'>
											<p>Latitude</p><br/>
											<Input
												size={ 'small' }
												className={ coords && coords[0] ? 'in_border' : null }
												value={ coords?.[0] || undefined }
												onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
												placeholder="Latitude"
												error={ countryUpdateErr.coords ? countryUpdateErr.coords.replaceAll('_', ' ') : null }
												defaultValue={ coords?.[0] ? undefined : country?.coords?.[0] }
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
												error={ countryUpdateErr.coords ? countryUpdateErr.coords.replaceAll('_', ' ') : null }
												defaultValue={ coords?.[1] ? undefined : country?.coords?.[1] }
											/>
										</label>
										<div className='coords__update_label'>
											<Button onClick={ () => this.handleSubmitCoords() } className={ "add__user" }
											        variant="contained" title="Save">
												Save
											</Button>
										</div>
									</div>
									<div className="country__update_label">
										<YMap coords={ !_.isEmpty(coords) ? coords : country?.coords }
										      state={ !_.isEmpty(coords) ? coords : country?.coords }
										      onClick={ this.onMapClick } input={ this.input }
										      s={ (ev) => this.onMapClick(ev.get('target').getCenter()) }
										      onSuggestSelect={ this.onSuggestSelect }/>
										<br/>
										<p className="err">
											{ countryUpdateErr.coords ? ErrorEnum[countryUpdateErr.coords] ? ErrorEnum[countryUpdateErr.coords]
												: countryUpdateErr.coords.replaceAll('_', ' ') : null }</p>
									</div>
								</div>
								<div className="update__buttons_row">
									<ModalButton
										title={ "Delete" }
										label={ "Delete Country" }
										className={ "add__user" }
										cl={ 'log_out' }
										text={ "Are you sure you want to delete country?" }
										button={ "Delete Country" }
										enter={ "Yes" }
										onClick={ () => this.props.deletingCountry(country?.id).then(() => {
											this.props.getCountries();
											this.props.history.push('/countries');
										}) }
									/>
									<Button onClick={ () => this.handleSubmit(country?.id) }
									        className={ _.isEmpty(updateFormData) || countryUpdateStatus === "request" ? "" : "add__user" }
									        disabled={ _.isEmpty(updateFormData) || countryUpdateStatus === "request" }
									        variant="contained" title="Save">
										{ countryUpdateStatus === 'request' ? 'Wait...' : 'Save' }
									</Button>
								</div>
							</div>
						</div>
						: <><br/><p className="center">{ country ? "loading..." : "No such country" }</p></> }
					<Results/>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	country: state.location.country,
	countryStatus: state.location.countryStatus,
	countryUpdate: state.location.countryUpdate,
	countryUpdateErr: state.location.countryUpdateErr,
	countryUpdateStatus: state.location.countryUpdateStatus,
})

const mapDispatchToProps = {
	getCountry,
	getCountries,
	updateCountry,
	deletingCountry,
}

const CountryUpdateContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(CountryUpdate)

export default CountryUpdateContainer;
