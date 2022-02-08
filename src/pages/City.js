import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";
import { Autorenew, LocationCity, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { createCity, getCities, getCountries } from "../store/actions/admin/location";
import Results from "../components/utils/Results";
import YMap from "../components/map/ymap";
import CityTable from "../components/tables/cityTable";
import Input from "../components/form/Input";
import InputRadio from "../components/form/Radio";
import UserHeader from "../components/UserHeader";
import SearchSelect from "../components/form/SelectSearch";

class City extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coords: [],
			createFormData: {},
		};
		this.input = React.createRef();
	}

	componentDidMount() {
		const {page} = this.props.match.params;
		this.props.getCities(page ? page : 1);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.cityCreate !== this.props.cityCreate){
			return this.props.cityCreate;
		}
	}

	handleSearchSelect = (path, ev) => {
		if (path === 's'){
			this.props.getCountries(1, void 0, void 0, void 0, ev);
		}
	}

	handleSelectFilter = (page, sk, s, i) => {
		this.props.getCities(page, sk, s, i)
	}

	handleChange = (path, value) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, _.trim(value));
		this.setState({createFormData});
	};

	handleSubmit = () => {
		const {createFormData} = this.state;
		this.props.createCity(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getCities();
				this.setState({createFormData: {}});
			}
		})
	}

	resetAll = () => {
		this.setState({createFormData: {}, coords: []});
		this.props.getCities(1)
		this.props.history.push(`/city/${ 1 }`);
	}

	onMapClick = (ev) => {
		const coords = _.isArray(ev) ? ev : ev.get("coords");
		const {createFormData} = this.state;
		_.set(createFormData, "coords", coords);
		this.setState({createFormData, coords});
	}

	onSuggestSelect = (e) => {
		const name = e.get("item").value;
		const {createFormData} = this.state;
		_.set(createFormData, 'name', _.trim(name));
		this.setState({createFormData});
	};

	handleChangeCoords = (path, ev) => {
		const {coords} = this.state;
		if (path === "lat"){
			coords[0] = ev;
		}
		if (path === "lon"){
			coords[1] = ev;
		}
		this.setState({coords})
	}

	handleSubmitCoords = () => {
		const {createFormData, coords} = this.state;
		_.set(createFormData, "coords", coords);
		this.setState({createFormData});
	}

	render() {
		const {
			allCountries, allCities, cityStatus, cityCreate, cityCreateErr, cityCreateStatus,
			myAccount, location
		} = this.props;
		const {coords, createFormData} = this.state;
		const s = new URLSearchParams(location.search);

		return (
			<Wrapper showFooter={ false }>
				<UserHeader title="City list"/>
				<div className="container">
					<div className="users__content">
						<div className="users__filter_area">
							<div className="search_input">
								<Search fontSize="small" className="search_icon"/>
								<input type="search" placeholder='Search'/>
							</div>
							<Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
								<Button color="inherit" variant="contained">
									<Autorenew/>
								</Button>
							</Tooltip>
							{ +myAccount.role === 1 ? <ModalButton
								title={ "Add City" }
								label={ "Add City" }
								button={ <><LocationCity fontSize="small"/>&ensp;Add City</> }
								enter={ cityCreateStatus === 'request' ? "Wait..." : "Submit" }
								className={ "add__user" }
								c={ true }
								onClick={ () => cityCreateStatus === 'request' ? null : this.handleSubmit() }
								input={
									<div className="user__create_content">
										<label className="user__create_label">
											<p>Country</p><br/>
											<SearchSelect
												data={ [{value: '', label: '- Choose Country -'}, ..._.map(allCountries?.array, (v) => ({
													value: v.id,
													label: `${ v.id }) ${ v.name || 'No name' }`,
												}))] }
												required={ true }
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
												value={ createFormData.countryId ? createFormData.countryId : '' }
												errors={ cityCreateErr.countryId ? cityCreateErr.countryId.replaceAll('_', ' ') : null }
											/>
										</label>
										<label className='user__create_label'>
											<p>City Name</p><br/>
											<input ref={ this.input }
											       onChange={ (ev) => this.handleChange('name', ev.target.value) }
											       placeholder="City Name"
											       className='country__create_input'/>
											<p className="err">
												{ cityCreateErr.name ? cityCreateErr.name.replaceAll('_', ' ') : null }<br/>
												{ cityCreate?.status === false ? cityCreate?.message.replaceAll('_', ' ') : null }
											</p>
										</label>
										<br/>
										<div className="user__create_label">
											<InputRadio
												label={ 'User Take' }
												first={ 'Yes' }
												second={ 'No' }
												firstValue={ true }
												secondValue={ false }
												value={ createFormData.isCanTakePassengers ? createFormData.isCanTakePassengers.toString() === 'true' : true }
												onChange={ (event) => this.handleChange('isCanTakePassengers', event.target.value) }
											/>
										</div>
										<div className="update__latLon_row">
											<label className='coords__update_label'>
												<p>Latitude</p><br/>
												<Input
													size={ 'small' }
													value={ coords && coords[0] ? coords[0] : '' }
													onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
													placeholder="Latitude"
													error={ cityCreateErr.coords ? cityCreateErr.coords.replaceAll('_', ' ') : null }
												/>
											</label>&ensp;
											<label className='coords__update_label'>
												<p>Longitude</p><br/>
												<Input
													size={ 'small' }
													value={ coords && coords[1] ? coords[1] : '' }
													onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
													placeholder="Longitude"
													error={ cityCreateErr.coords ? cityCreateErr.coords.replaceAll('_', ' ') : null }
												/>
											</label>&ensp;
											<div className='coords__update_label'>
												<Button onClick={ () => this.handleSubmitCoords() } className={ "add__user" }
												        variant="contained" title="Save">
													Save
												</Button>
											</div>
										</div>
										<YMap onClick={ this.onMapClick } state={ coords } coords={ coords } input={ this.input }
										      s={ (ev) => this.onMapClick(ev.get('target').getCenter()) }
										      onSuggestSelect={ this.onSuggestSelect }/>
										<br/>
										<p className="err">{ cityCreateErr.coords ? cityCreateErr.coords.replaceAll('_', ' ') : null }</p>
									</div>
								}
							/> : null }
						</div>
						{ cityStatus === 'request' ? <p className="center">loading...</p> :
							_.isEmpty(allCities.array) ? <p className="center">No Cities</p> :
								<CityTable data={ allCities.array } role={ myAccount } onClick={ this.props.getCities }/>
						}
						<br/>
						<br/>
						<div className="center">
							<Pagination
								count={ +allCities?.totalPages } variant="outlined" page={ +allCities?.currentPage }
								shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
								onChange={ (event, page) => {
									this.handleSelectFilter(page, s.get('sk') || void 0, s.get('sort') || void 0, s.get('i') || '');
								} }
								renderItem={ (item) => (
									<PaginationItem
										type={ "start-ellipsis" }
										component={ Link }
										selected
										to={ `/city/${ item.page }?sk=${ s.get('sk') }&sort=${ s.get('sort') }&i=${ s.get('i') }` }
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
	cityStatus: state.location.cityStatus,
	allCities: state.location.allCities,
	allCountries: state.location.allCountries,
	cityCreate: state.location.cityCreate,
	cityCreateErr: state.location.cityCreateErr,
	cityCreateStatus: state.location.cityCreateStatus,
	myAccount: state.users.myAccount,
})

const mapDispatchToProps = {
	getCities,
	getCountries,
	createCity,
}

const CityContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(City)

export default withRouter(CityContainer);
