import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import _ from "lodash";
import { Button, Tooltip } from "@mui/material";
import { Autorenew, FilterList, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import { createDriver, getDrivers, getPartners, getSelectUsers } from "../store/actions/admin/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCar } from "@fortawesome/free-solid-svg-icons";
import DriverTable from "../components/tables/driverTable";
import Input from "../components/form/Input";
import SelectNumber from "../components/form/SelectNumber";
import SelectYear from "../components/form/SelectYear";
import UserHeader from "../components/UserHeader";
import SearchSelect from "../components/form/SelectSearch";
import { validateInput } from "../helpers/InputValidation"
import TypeCheckbox from "../components/form/TypeCheckbox";
import { connect } from "react-redux";
import { Pagination, PaginationItem } from "@mui/lab";
import Results from "../components/utils/Results";

class Drivers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createFormData: {}, formData: {
				page: 1,
			},
		};
	}

	componentDidMount() {
		const {page} = this.props.match.params;
		this.props.getDrivers(page ? page : 1);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.driverCreate !== this.props.driverCreate){
			return this.props.driverCreate;
		}
	}

	handleSearchSelect = (path, ev) => {
		if (path === 's'){
			this.props.getSelectUsers(1, ev);
		}
		if (path === 'partner'){
			this.props.getPartners(1, ev);
		}
	}

	handleSelectFilter = (path, event) => {
		const s = new URLSearchParams(this.props.location.search);
		const {formData} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
		this.props.getDrivers(formData.page, formData.id, formData.make, formData.model, formData.color, formData.year ? new Date(formData.year).getFullYear() : void 0, formData.passengersSeat, formData.number, formData.type, formData.partner, s.get('sk') || 'id', s.get('sort') || true, s.get('i') || '')
	}

	handleChangeFilter = (path, event) => {
		const {formData} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
	}

	handleSearch = () => {
		const {formData} = this.state;
		const s = new URLSearchParams(this.props.location.search);
		this.props.getDrivers(formData.page, formData.id, formData.make, formData.model, formData.color, formData.year ? new Date(formData.year).getFullYear() : void 0, formData.passengersSeat, formData.number, formData.type, formData.partner, s.get('sk') || 'id', s.get('sort') || true, s.get('i') || '')
	}

	handleChange = (path, value) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, path === 'carYear' ? new Date(value).getFullYear() : value);
		if (path === "carYear"){
			_.set(createFormData, "fullDate", _.trim(value));
		}
		this.setState({createFormData});
	};

	handleSubmit = () => {
		const {createFormData} = this.state;
		this.props.createDriver(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getDrivers(1);
				this.setState({createFormData: {}});
			}
		})
	}

	resetAll = () => {
		this.setState({createFormData: {}, formData: {page: 1}});
		this.props.getDrivers(1);
		this.props.history.push(`/drivers/${ 1 }`);
	}

	render() {
		const {
			allDrivers, driverCreateErr, driverGetError, allUsers, location, allPartners, driverCreateStatus
		} = this.props;
		const {createFormData, formData} = this.state;
		const s = new URLSearchParams(location.search);

		return (<Wrapper showFooter={ false }>
				<UserHeader title="Driver list"/>
				<div className="container">
					<div className="users__content">
						<div className="users__filter_area">
							<div className="search_input driver_search_input">
								<Search fontSize="small" className="search_icon"/>
								<input type="search" placeholder='Search'/>
							</div>
							<ModalButton
								title={ "Filter" }
								label={ "Filter" }
								button={ <FilterList/> }
								input={ <div className="users__filter_row">
									<label className="filter__label_row">
										<p style={ {textAlign: 'center'} }>Partner</p>
										<SearchSelect
											data={ [{value: '', label: '- Choose Partner -'}, ..._.map(allPartners?.array || [], (v) => ({
												value: v.id, label: `${ v.id }) ${ v.name || 'No name' }`,
											}))] }
											name="Partner"
											onFocus={ () => this.props.getPartners(1) }
											onScrollTop={ () => {
												if (allPartners?.currentPage > 1){
													this.props.getPartners(allPartners?.currentPage ? allPartners?.currentPage - 1 : 1)
												}
											} }
											onScroll={ () => {
												if (allPartners?.currentPage < allPartners?.totalPages){
													this.props.getPartners(allPartners?.currentPage ? allPartners?.currentPage + 1 : 1)
												}
											} }
											onInputChange={ (event) => this.handleSearchSelect('partner', event) }
											onChange={ (event) => this.handleSelectFilter('partner', event?.value) }
											errors={ driverGetError?.partner ? driverGetError.partner.replaceAll('_', ' ') : null }
										/>
									</label>
									<br/>
									<div className="fLR">
										<div className="filter__label_row">
											<label className="filter__label">
												<Input
													size={ 'small' }
													label={ "Id" }
													type={ "number" }
													value={ formData.id ? formData.id : '' }
													inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
													errors={ driverGetError?.id ? driverGetError.id : null }
													placeholder={ "Id" }
													title={ formData.id }
													autoComplete="on"
													onChange={ (event) => this.handleChangeFilter('id', validateInput(event.target.value)) }
												/>
											</label>
											<label className="filter__label">
												<Input
													size={ 'small' }
													label={ "Make" }
													type={ "text" }
													mask={ "******************************" }
													maskChar={ '' }
													value={ formData.make ? formData.make : '' }
													errors={ driverGetError?.make ? driverGetError.make.replaceAll('_', ' ') : null }
													placeholder={ "Make" }
													title={ formData.make }
													autoComplete="on"
													onChange={ (event) => this.handleChangeFilter('make', event.target.value) }
												/>
											</label>
										</div>
										<div className="filter__label_row">
											<label className="filter__label">
												<Input
													size={ 'small' }
													label={ "Model" }
													type={ "text" }
													mask={ "******************************" }
													maskChar={ '' }
													value={ formData.model ? formData.model : '' }
													errors={ driverGetError?.model ? driverGetError.model.replaceAll('_', ' ') : null }
													placeholder={ "Model" }
													title={ formData.model }
													autoComplete="on"
													onChange={ (event) => this.handleChangeFilter('model', event.target.value) }
												/>
											</label>
											<label className="filter__label">
												<Input
													size={ 'small' }
													label={ "Color" }
													type={ "text" }
													mask={ "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
													maskChar={ '' }
													value={ formData.color ? formData.color : '' }
													errors={ driverGetError?.color ? driverGetError.color.replaceAll('_', ' ') : null }
													placeholder={ "Color" }
													title={ formData.color }
													autoComplete="on"
													onChange={ (event) => this.handleChangeFilter('color', event.target.value) }
												/>
											</label>
										</div>
									</div>
									<label className="driver__filter_label">
										<Input
											size={ 'small' }
											label={ "Car Number" }
											type={ "text" }
											mask={ "******************************" }
											maskChar={ '' }
											value={ formData.number ? formData.number : '' }
											className={ 'driver__filter_label' }
											errors={ driverGetError?.number ? driverGetError.number.replaceAll('_', ' ') : null }
											placeholder={ "Car Number" }
											title={ formData.number }
											autoComplete="on"
											onChange={ (event) => this.handleChangeFilter('number', event.target.value) }
										/>
									</label>
									<div className="filter_button" onClick={ () => this.handleSearch() }>
										<Button color="primary" variant="contained">
											<Search fontSize="small"/>
											Search
										</Button>
									</div>
									<hr/>
									<br/>
									<div className="fLR">
										<label className="filter__label_row">
											<p style={ {textAlign: 'center'} }>Car Year</p>
											<SelectYear
												className={ "select_year" }
												label={ 'Select Year' }
												value={ formData.year }
												title={ formData.year }
												errors={ driverGetError?.year ? driverGetError.year.replaceAll('_', ' ') : null }
												onChange={ (newValue) => this.handleSelectFilter('year', +newValue) }
											/>
										</label>
										<label className="filter__label_row">
											<p style={ {textAlign: 'center'} }>Passengers Seat</p>
											<SelectNumber
												plus={ true }
												defaultValue={ '' }
												value={ formData.passengersSeat ? formData.passengersSeat : '' }
												data={ Array.from(Array(21).keys()) }
												errors={ driverGetError?.passengersSeat ? driverGetError.passengersSeat.replaceAll('_', ' ') : null }
												onChange={ (event) => this.handleSelectFilter('passengersSeat', event.target.value) }
											/>
										</label>
									</div>
								</div> }
							/>
							<Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
								<Button color="inherit" variant="contained">
									<Autorenew/>
								</Button>
							</Tooltip>
							<Button variant="outlined" className="active_driver_button">
								<Link to="/active_drivers">Active Drivers</Link>
							</Button>
							<ModalButton
								title={ "Add Driver" }
								label={ "Add Driver" }
								button={ <><FontAwesomeIcon icon={ faCar }/>&ensp;Add Driver</> }
								enter={ driverCreateStatus === 'request' ? 'Wait...' : "Submit" }
								className={ "add__user" }
								c={ true }
								onClick={ () => driverCreateStatus === 'request' ? null : this.handleSubmit() }
								input={ <div className="user__create_content">
									<label className="user__create_label">
										<p>User Name</p><br/>
										<SearchSelect
											data={ [{value: '', label: '- Choose User -'}, ..._.map(allUsers?.array || [], (v) => ({
												value: v.id,
												label: `${ v.id }) ${ v.firstName || 'No firstname' } ${ v.lastName || 'No lastname' } | ${ v.phoneNumber || 'No phone' } | ${ v.username || 'No username' }`,
											}))] }
											required={ true }
											name="User"
											onFocus={ () => this.props.getSelectUsers(1) }
											onScrollTop={ () => {
												if (allUsers?.currentPage > 1){
													this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage - 1 : 1)
												}
											} }
											onScroll={ () => {
												if (allUsers?.currentPage < allUsers?.totalPages){
													this.props.getSelectUsers(allUsers?.currentPage ? allUsers?.currentPage + 1 : 1)
												}
											} }
											onInputChange={ (event) => this.handleSearchSelect('s', event) }
											onChange={ (event) => this.handleChange('userId', event?.value) }
											value={ createFormData.userId ? createFormData.userId : '' }
											errors={ driverCreateErr.userId ? driverCreateErr.userId.replaceAll('_', ' ') : null }
										/>
									</label>
									<label className="user__create_label">
										<p>Car Make</p><br/>
										<Input
											size={ 'small' }
											type={ "text" }
											mask={ "******************************" }
											maskChar={ '' }
											className={ 'user__create_input' }
											errors={ driverCreateErr.carMake ? driverCreateErr.carMake : null }
											placeholder={ "Car Make" }
											title={ createFormData.carMake }
											onChange={ (event) => this.handleChange('carMake', event.target.value) }
										/>
									</label>
									<label className="user__create_label">
										<p>Car Model</p><br/>
										<Input
											size={ 'small' }
											type={ "text" }
											mask={ "******************************" }
											maskChar={ '' }
											className={ 'user__create_input' }
											errors={ driverCreateErr.carModel ? driverCreateErr.carModel : null }
											placeholder={ "Car Model" }
											title={ createFormData.carModel }
											onChange={ (event) => this.handleChange('carModel', event.target.value) }
										/>
									</label>
									<div className="driver__create_row">
										<label className="driver__create_label">
											<p>Car Color</p><br/>
											<Input
												size={ "small" }
												placeholder={ "Color" }
												mask={ "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
												maskChar={ '' }
												title={ createFormData.carColor }
												errors={ driverCreateErr.carColor ? driverCreateErr.carColor.replaceAll('_', ' ') : null }
												onChange={ (event) => this.handleChange('carColor', event.target.value) }
											/>
										</label>
										&ensp;
										<label className="driver__create_label">
											<p>Car Year</p><br/>
											<SelectYear
												className={ "select_year" }
												label={ 'Choose Year' }
												value={ createFormData.fullDate }
												title={ createFormData.carYear }
												errors={ driverCreateErr.carYear ? driverCreateErr.carYear.replaceAll('_', ' ') : null }
												onChange={ (newValue) => this.handleChange('carYear', +newValue) }
											/>
										</label>
										&ensp;
										<label className="driver__create_label">
											<p>Car Passangers Seat</p><br/>
											<SelectNumber
												plus={ true }
												defaultValue={ '' }
												value={ createFormData.carPassengersSeat ? createFormData.carPassengersSeat : '' }
												data={ Array.from(Array(21).keys()) }
												errors={ driverCreateErr.carPassengersSeat ? driverCreateErr.carPassengersSeat.replaceAll('_', ' ') : null }
												onChange={ (event) => this.handleChange('carPassengersSeat', event.target.value) }
											/>
										</label>
									</div>
									<label className="user__create_label">
										<p>Car Number</p><br/>
										<Input
											size={ 'small' }
											type={ "text" }
											mask={ "******************************" }
											maskChar={ '' }
											className={ 'user__create_input' }
											errors={ driverCreateErr.carNumber ? driverCreateErr.carNumber : null }
											placeholder={ "Car Number" }
											title={ createFormData.carNumber }
											onChange={ (event) => this.handleChange('carNumber', event.target.value) }
										/>
									</label>
									<label className="user__create_label">
										<TypeCheckbox
											label={ 'Type' }
											label1={ 'Out city' }
											label2={ 'In city' }
											onChange={ this.handleChange }
											path={ 'type' }
										/>
										<p className="err">{ driverCreateErr.type ? driverCreateErr.type : null }</p>
									</label>
								</div> }
							/>
						</div>
						{ _.isEmpty(allDrivers.array) ? <p className="center">No Drivers</p> : <DriverTable
							data={ allDrivers.array ? allDrivers.array : [] }
							formData={ formData } onClick={ this.props.getDrivers }
						/> }
						<br/>
						<br/>
						<div className="center">
							<Pagination
								count={ +allDrivers?.totalPages } variant="outlined" page={ +allDrivers?.currentPage }
								shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
								onChange={ (event, page) => {
									this.handleSelectFilter('page', page);
								} }
								renderItem={ (item) => (<PaginationItem
										type={ "start-ellipsis" }
										component={ Link }
										selected
										to={ `/drivers/${ item.page }?sk=${ s.get('sk') || 'id' }&sort=${ s.get('sort') || true }&i=${ s.get('i') || '' }` }
										{ ...item }
									/>) }
							/>
						</div>
						<br/>
					</div>
				</div>
				<Results/>
			</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	allDrivers: state.users.allDrivers,
	allPartners: state.users.allPartners,
	allUsers: state.users.allUsers,
	driverGetError: state.users.driverGetError,
	driverCreate: state.users.driverCreate,
	driverCreateErr: state.users.driverCreateErr,
	driverCreateStatus: state.users.driverCreateStatus,
})

const mapDispatchToProps = {
	getDrivers, getPartners, getSelectUsers, createDriver,
}

const DriversContainer = connect(mapStateToProps, mapDispatchToProps,)(Drivers)

export default withRouter(DriversContainer);
