import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import '../assets/css/pages/location.css'
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";
import { Autorenew, Flag, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { createCountry, getCountries } from "../store/actions/admin/location";
import CountryTable from "../components/tables/countryTable";
import Results from "../components/utils/Results";
import YMap from "../components/map/ymap";
import Input from "../components/form/Input";
import UserHeader from "../components/UserHeader";

class Countries extends Component {
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
		this.props.getCountries(page ? page : 1);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.countryCreate !== this.props.countryCreate){
			return this.props.countryCreate;
		}
	}

	handleSelectFilter = (page, sk, s, i) => {
		this.props.getCountries(page, sk, s, i)
	}

	handleChange = (path, value) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, _.trim(value));
		this.setState({createFormData});
	};

	handleSubmit = () => {
		const {createFormData} = this.state;
		this.props.createCountry(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getCountries();
				this.setState({createFormData: {}});
			}
		})
	}

	resetAll = () => {
		this.setState({createFormData: {}, coords: []});
		this.props.getCountries(1)
		this.props.history.push(`/countries/${ 1 }`);
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
			allCountries, countryStatus, countryCreate, countryCreateErr,
			myAccount, location, countryCreateStatus,
		} = this.props;
		const {coords} = this.state;
		const s = new URLSearchParams(location.search);

		return (
			<Wrapper showFooter={ false }>
				<UserHeader title="Countries list"/>
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
							{ +myAccount?.role === 1 ? <ModalButton
								title={ "Add Country" }
								label={ "Add Country" }
								button={ <><Flag fontSize="small"/>&ensp;Add Country</> }
								enter={ countryCreateStatus === 'request' ? "Wait..." : "Submit" }
								className={ "add__user" }
								c={ true }
								onClick={ () => countryCreateStatus === 'request' ? null : this.handleSubmit() }
								input={
									<div className="user__create_content">
										<label className='user__create_label'>
											<p>Country Name</p><br/>
											<input ref={ this.input }
											       onChange={ (ev) => this.handleChange('name', ev.target.value) }
											       placeholder="Country Name"
											       className='country__create_input'/>
											<p className="err">
												{ countryCreateErr.name ? countryCreateErr.name.replaceAll('_', ' ') : null }<br/>
												{ countryCreate?.status === false ? countryCreate?.message.replaceAll('_', ' ') : null }
											</p>
										</label>
										<br/>
										<div className="update__latLon_row">
											<label className='coords__update_label'>
												<p>Latitude</p><br/>
												<Input
													size={ 'small' }
													value={ coords && coords[0] ? coords[0] : '' }
													onChange={ (ev) => this.handleChangeCoords('lat', ev.target.value) }
													placeholder="Latitude"
													error={ countryCreateErr.coords ? countryCreateErr.coords.replaceAll('_', ' ') : null }
												/>
											</label>&ensp;
											<label className='coords__update_label'>
												<p>Longitude</p><br/>
												<Input
													size={ 'small' }
													value={ coords && coords[1] ? coords[1] : '' }
													onChange={ (ev) => this.handleChangeCoords('lon', ev.target.value) }
													placeholder="Longitude"
													error={ countryCreateErr.coords ? countryCreateErr.coords.replaceAll('_', ' ') : null }
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
										<p
											className="err">{ countryCreateErr.coords ? countryCreateErr.coords.replaceAll('_', ' ') : null }</p>
									</div>
								}
							/> : null }
						</div>
						{ countryStatus === 'request' ? <p className="center">loading...</p> :
							_.isEmpty(allCountries.array) ? <p className="center">No Countries</p> :
								<CountryTable data={ allCountries.array } role={ myAccount } onClick={ this.props.getCountries }/>
						}
						<br/>
						<br/>
						<div className="center">
							<Pagination
								count={ +allCountries?.totalPages } variant="outlined" page={ +allCountries?.currentPage }
								shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
								onChange={ (event, page) => {
									this.handleSelectFilter(page, s.get('sk') || void 0, s.get('sort') || void 0, s.get('i') || '');
								} }
								renderItem={ (item) => (
									<PaginationItem
										type={ "start-ellipsis" }
										component={ Link }
										selected
										to={ `/countries/${ item.page }?sk=${ s.get('sk') }&sort=${ s.get('sort') }&i=${ s.get('i') }` }
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
	countryStatus: state.location.countryStatus,
	allCountries: state.location.allCountries,
	countryCreate: state.location.countryCreate,
	countryCreateErr: state.location.countryCreateErr,
	countryCreateStatus: state.location.countryCreateStatus,
	myAccount: state.users.myAccount,
})

const mapDispatchToProps = {
	getCountries,
	createCountry,
}

const CountriesContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Countries)

export default withRouter(CountriesContainer);
