import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import '../assets/css/pages/allUsers.css'
import { connect } from "react-redux";
import { createUser, getAllUsers } from "../store/actions/admin/users";
import Table from "../components/tables/table";
import _ from "lodash";
import Selects from "../components/form/Select";
import Input from "../components/form/Input";
import { Autorenew, FilterList, PersonAdd, Search } from "@material-ui/icons";
import ModalButton from "../components/modals/modal";
import { Link, withRouter } from "react-router-dom";
import InputRadio from "../components/form/Radio";
import InputCheckbox from "../components/form/Checkbox";
import InputPassword from "../components/form/InputPassword";
import ErrorEnum from "../helpers/ErrorHandler";
import UserHeader from "../components/UserHeader";
import PhoneInput from "../components/form/PhoneInput";
import { validateInput } from "../helpers/InputValidation"
import { Button, Pagination, PaginationItem, Tooltip } from "@mui/material";

class AllUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
			userFormData: {
				verified: true,
			},
		}
	}

	componentDidMount() {
		const {page} = this.props.match.params;
		this.props.getAllUsers(void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, page);
	}

	handleSelectFilter = (path, event) => {
		const s = new URLSearchParams(this.props.location.search);
		const {formData} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
		this.props.getAllUsers(formData.id, s.get('sk') || 'id', s.get('sort') || true, formData.phoneNumber, formData.username,
			formData.firstName, formData.lastName, formData.email, formData.verified, formData.deleted, formData.role, 1);
		this.props.history.push(`/all_users/1?sk=${ s.get('sk') || 'id' }&sort=${ s.get('sort') || true }`);
	}

	handleChange = (path, event) => {
		const {formData} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
	}

	handleCreate = (path, event) => {
		const {userFormData} = this.state;
		_.set(userFormData, path, event);
		this.setState({userFormData});
	}

	handleSubmit = () => {
		const {userFormData} = this.state;
		this.props.createUser(userFormData).then((d) => {
			if (d.payload.data.status === true){
				this.props.getAllUsers();
				this.setState({userFormData: {}});
			}
		})
	}

	handleSearch = () => {
		const {formData} = this.state;
		const s = new URLSearchParams(this.props.location.search);
		this.props.getAllUsers(formData.id, s.get('sk') || 'id', s.get('sort') || true, formData.phoneNumber, formData.username,
			formData.firstName, formData.lastName, formData.email, formData.verified, formData.deleted, formData.role, formData.page);
		this.props.history.push(`/all_users/1?sk=${ s.get('sk') || 'id' }&sort=${ s.get('sort') || true }`);
	}

	resetAll = () => {
		this.setState({formData: {}});
		this.props.getAllUsers(void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, 1)
		this.props.history.push(`/all_users/${ 1 }`);
	}

	render() {
		const {allUsers, userGetError, createError, myAccount, userCreateStatus, activeUsers} = this.props;
		const {formData, userFormData} = this.state;
		const s = new URLSearchParams(this.props.location.search);

		return (
			<Wrapper showFooter={ false }>
				<UserHeader title="Users list"/>
				<div className="container">
					<div className="users__content">
						<div className="users__filter_area">
							<div className="search_input">
								<Search fontSize="small" className="search_icon"/>
								<input type="search" placeholder='Search'/>
							</div>
							<ModalButton
								title={ "Filter" }
								label={ "Filter" }
								button={ <FilterList/> }
								input={
									<div className="users__filter_row">
										<div className="fLR">
											<div className="filter__label_row">
												<label className="filter__label">
													<Input
														size={ 'small' }
														label={ "Id" }
														type={ "number" }
														inputProps={ {inputMode: 'numeric', pattern: '[0-9]'} }
														errors={ userGetError?.id ? userGetError.id : null }
														placeholder={ "Id" }
														title={ formData.id }
														autoComplete="on"
														onChange={ (event) => this.handleChange('id', validateInput(event.target.value) || '') }
													/>
												</label>
												<label className="filter__label">
													<Input
														size={ 'small' }
														label={ "Username" }
														type={ "text" }
														mask={ "******************************" }
														maskChar={ '' }
														errors={ userGetError?.username ? userGetError.username.replaceAll('_', ' ') : null }
														placeholder={ "Username" }
														title={ formData.username }
														autoComplete="on"
														onChange={ (event) => this.handleChange('username', event.target.value) }
													/>
												</label>
												<label className="filter__label">
													<Input
														size={ 'small' }
														label={ "FirstName" }
														type={ "text" }
														mask={ "******************************" }
														maskChar={ '' }
														errors={ userGetError?.firstName ? userGetError.firstName.replaceAll('_', ' ') : null }
														placeholder={ "FirstName" }
														title={ formData.firstName }
														autoComplete="on"
														onChange={ (event) => this.handleChange('firstName', event.target.value) }
													/>
												</label>
											</div>
											<div className="filter__label_row">
												<label className="filter__label">
													<PhoneInput
														errors={ userGetError?.phoneNumber ? userGetError.phoneNumber.replaceAll('_', ' ')
															: null }
														title={ formData.phoneNumber }
														onChange={ (event) => this.handleChange('phoneNumber', event.toString().includes('+') ? event : `+${ event }`) }
													/>
												</label>
												<label className="filter__label">
													<Input
														size={ 'small' }
														label={ "Email" }
														type={ "email" }
														inputProps={ {inputMode: 'numeric', pattern: '[0-9]*'} }
														errors={ userGetError?.email ? userGetError.email.replaceAll('_', ' ') : null }
														placeholder={ "example@mail.com" }
														title={ formData.email }
														autoComplete="on"
														onChange={ (event) => this.handleChange('email', event.target.value) }
													/>
												</label>
												<label className="filter__label">
													<Input
														size={ 'small' }
														label={ "LastName" }
														type={ "text" }
														mask={ "******************************" }
														maskChar={ '' }
														errors={ userGetError?.lastName ? userGetError.lastName.replaceAll('_', ' ') : null }
														placeholder={ "LastName" }
														title={ formData.lastName }
														autoComplete="on"
														onChange={ (event) => this.handleChange('lastName', event.target.value) }
													/>
												</label>
											</div>
										</div>
										<div className="filter_button" onClick={ () => this.handleSearch() }>
											<Button color="primary" variant="contained">
												<Search fontSize="small"/>
												Search
											</Button>
										</div>
										<hr/>
										<br/>
										<div className="dfj">
											<label className="filter__label">
												<InputCheckbox
													label={ 'Verified' }
													label1={ 'Yes' }
													label2={ 'No' }
													onChange={ this.handleSelectFilter }
													path={ 'verified' }
												/>
											</label>
											<label className="filter__label">
												<InputCheckbox
													label={ 'Deleted' }
													label1={ 'Yes' }
													label2={ 'No' }
													onChange={ this.handleSelectFilter }
													path={ 'deleted' }
												/>
											</label>
										</div>
										<label className="filter__label">
											<h5>&ensp;Role</h5><br/>
											<Selects
												size={ "small" }
												df={ 'All' }
												data={ +myAccount?.role === 1 ? [
													{value: 1, name: '1 - Admin'},
													{value: 2, name: '2 - Operator'},
													{value: 3, name: '3 - Driver'},
													{value: 4, name: '4 - Client'},
													{value: 5, name: '5 - Partner'},
												] : [
													{value: 3, name: '3 - Driver'},
													{value: 4, name: '4 - Client'},
													{value: 5, name: '5 - Partner'},
												] }
												value={ formData.role }
												title={ formData.role }
												vName={ 'name' }
												keyValue={ 'value' }
												onChange={ (event) => this.handleSelectFilter('role', event.target.value) }
											/>
										</label>
									</div>
								}
							/>
							<Tooltip title="Reset All" arrow onClick={ () => this.resetAll() }>
								<Button color="inherit" variant="contained">
									<Autorenew/>
								</Button>
							</Tooltip>
							<ModalButton
								title={ "Add User" }
								label={ "Add User" }
								button={ <><PersonAdd fontSize="small"/>&ensp;Add User</> }
								enter={ userCreateStatus === 'request' ? "Wait..." : "Submit" }
								className={ "add__user" }
								c={ true }
								onClick={ () => userCreateStatus === 'request' ? null : this.handleSubmit() }
								input={
									<div className="user__create_content">
										<label className='user__create_label'>
											<p>Phone Number</p><br/>
											<PhoneInput
												errors={ createError.phoneNumber ?
													ErrorEnum[createError.phoneNumber] ? ErrorEnum[createError.phoneNumber]
														: createError.phoneNumber : null }
												value={ userFormData.phoneNumber ? userFormData.phoneNumber : '' }
												onChange={ (event) => this.handleCreate('phoneNumber', event.toString().includes('+') ? event : `+${ event }`) }
											/>
										</label>
										<br/>
										<label className='user__create_label'>
											<p>Password</p><br/>
											<InputPassword
												className={ 'user__create_input' }
												value={ userFormData.password ? userFormData.password : '' }
												errors={ createError.password ? createError.password.replaceAll('_', ' ') : null }
												onChange={ (event) => this.handleCreate('password', event.target.value) }
											/>
										</label>
										<label className='user__create_label'>
											<p>Role</p><br/>
											<Selects
												size={ "small" }
												className={ 'user__create_input' }
												df={ 'Choose a Role' }
												data={ +myAccount?.role === 1 ? [
													{value: 1, name: '1 - Admin'},
													{value: 2, name: '2 - Operator'},
													{value: 3, name: '3 - Driver'},
													{value: 4, name: '4 - Client'},
													{value: 5, name: '5 - Partner'},
												] : [
													{value: 3, name: '3 - Driver'},
													{value: 4, name: '4 - Client'},
													{value: 5, name: '5 - Partner'},
												] }
												errors={ createError.role ? createError.role.replaceAll('_', ' ') : null }
												value={ userFormData.role }
												vName={ 'name' }
												keyValue={ 'value' }
												onChange={ (event) => this.handleCreate('role', event.target.value) }
											/>
										</label>
										<InputRadio
											label={ 'Verified' }
											first={ 'Yes' }
											second={ 'No' }
											firstValue={ true }
											secondValue={ false }
											value={ userFormData.verified?.toString() === 'true' }
											onChange={ (event) => this.handleCreate('verified', event.target.value) }
										/>
									</div>
								}
							/>
						</div>
						{ _.isEmpty(allUsers.array) ? <p className="center">No Users</p>
							: <Table data={ allUsers.array ? allUsers.array : [] } onClick={ this.props.getAllUsers }
							         activeUsers={ activeUsers } formData={ formData }/> }
						<br/>
						<br/>
						<div className="center">
							<Pagination
								count={ +allUsers?.totalPages || 1 } variant="outlined" page={ +allUsers?.currentPage || 1 }
								shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
								onChange={ (event, page) => {
									this.props.getAllUsers(formData.id, s.get('sk') || 'id', s.get('sort') || true, formData.phoneNumber, formData.username, formData.firstName,
										formData.lastName, formData.email, formData.verified, formData.deleted, formData.role, page);
									this.handleChange('page', page);
								} }
								renderItem={ (item) => (
									<PaginationItem
										type={ "start-ellipsis" }
										component={ Link }
										selected
										to={ `/all_users/${ item.page }?sk=${ s.get('sk') || 'id' }&sort=${ s.get('sort') || true }` }
										{ ...item }
									/>
								) }
							/>
						</div>
						<br/>
					</div>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	allUsers: state.users.allUsers,
	myAccount: state.users.myAccount,
	userGetError: state.users.userGetError,
	createError: state.users.createError,
	userCreateStatus: state.users.userCreateStatus,
	activeUsers: state.users.activeUsers,
})

const mapDispatchToProps = {
	getAllUsers,
	createUser,
}

const AllUsersContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(AllUsers)

export default withRouter(AllUsersContainer);
