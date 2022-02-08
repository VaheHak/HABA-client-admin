import React, { Component } from 'react';
import _ from "lodash";
import { ArrowDropDown, ArrowDropUp, Close } from "@material-ui/icons";
import Input from "../components/form/Input";
import Selects from "../components/form/Select";
import { Button } from "@mui/material";
import { deletingUser, getUser, updateUser } from "../store/actions/admin/users";
import { connect } from "react-redux";
import moment from "moment";
import Wrapper from "../components/Wrapper";
import ModalButton from "../components/modals/modal";
import Results from "../components/utils/Results";
import { Link, NavLink } from "react-router-dom";
import InputRadio from "../components/form/Radio";
import ErrorEnum from "../helpers/ErrorHandler";
import PhoneInput from "../components/form/PhoneInput";

class UserUpdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.page,
			formData: {},
			open: false,
		};
	}

	componentDidMount() {
		const {id} = this.state;
		this.props.getUser(id);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const id = this.props.match.params.page;
		const {userUpdate} = this.props;
		if (+prevState.id !== +id){
			this.setState({id});
		}
		if (prevProps.userUpdate !== userUpdate){
			return userUpdate;
		}
	}

	handleChangeValue = (path, ev) => {
		const {formData} = this.state;
		_.set(formData, path, ev);
		this.setState({formData})
	}

	handleSubmit = (id) => {
		const {formData} = this.state;
		_.set(formData, 'id', id);
		this.setState({formData});
		this.props.updateUser(formData).then(async (d) => {
			if (d.payload.data.status === true){
				await this.props.getUser(id);
				this.setState({formData: {}})
			}
		});
	}

	openRef = () => {
		const {open} = this.state;
		this.setState({open: !open})
	}

	render() {
		const {upErrors, myAccount, singleUser, usersStatus, userUpdateStatus} = this.props;
		const {formData, open} = this.state;

		return (
			<Wrapper showFooter={ false }>
				<div className="container">
					{ usersStatus === "success" && singleUser ?
						<div className="add__content">
							<div className="user__header">
								<h3 className="users__title">User Update</h3>
								<NavLink to={ '/all_users' } title="Close"><Close/></NavLink>
							</div>
							<div className="users__filter_area">
								{ singleUser?.deleted ?
									<span className="user__deleted" style={ {background: '#BFC5CB'} }>Deleted</span>
									: null }
								<span className="create__date">
                  <p>Created at { moment(singleUser?.createdAt).format('DD.MM.YYYY') }</p>
                  <p>Updated at { moment(singleUser?.updatedAt).format('DD.MM.YYYY') }</p>
              </span>
								<div className="update__buttons_row">
									<ModalButton
										title={ "Delete" }
										label={ "Delete User" }
										className={ "add__user" }
										cl={ 'log_out' }
										text={ "Are you sure you want to delete your account?" }
										button={ "Delete User" }
										enter={ "Yes" }
										onClick={ () => this.props.deletingUser(singleUser?.id).then(() => this.props.getUser(singleUser?.id)) }
									/>
									<Button onClick={ () => this.handleSubmit(singleUser?.id) } variant={ "contained" } title="Save"
									        className={ _.isEmpty(formData) || userUpdateStatus === "request" ? "" : "add__user" }
									        disabled={ _.isEmpty(formData) || userUpdateStatus === "request" }
									>
										{ userUpdateStatus === 'request' ? 'Wait...' : 'Save' }
									</Button>
								</div>
							</div>
							<label className="user__update_label">
								<p>Phone Number</p><br/>
								<PhoneInput
									disabled={ !!singleUser?.deleted }
									errors={ upErrors.phoneNumber ? ErrorEnum[upErrors.phoneNumber] ? ErrorEnum[upErrors.phoneNumber]
										: upErrors.phoneNumber.replaceAll('_', ' ') : null }
									title={ formData.phoneNumber ? formData.phoneNumber : singleUser?.phoneNumber }
									onChange={ (event) => this.handleChangeValue('phoneNumber', event.toString().includes('+') ? event : `+${ event }`) }
									defaultValue={ singleUser?.phoneNumber }
								/>
							</label>
							<label className="user__update_label">
								<p>Password</p><br/>
								<Input
									size={ 'small' }
									disabled={ !!singleUser?.deleted }
									className={ `user__update_input ${ formData.password && formData.password !== singleUser?.password
										? 'in_border' : null }` }
									label={ upErrors.password ? "Error" : null }
									type={ "text" }
									placeholder={ "********" }
									errors={ upErrors.password ? upErrors.password.replaceAll('_', ' ') : null }
									title={ formData.password ? formData.password : "Locked" }
									onChange={ (event) => this.handleChangeValue('password', event.target.value) }
								/>
							</label>
							<label className="user__update_label">
								<p>Role</p><br/>
								<Selects
									size={ "small" }
									disabled={ !!singleUser?.deleted }
									className={ `user__update_input ${ formData.role && formData.role !== singleUser?.role
										? 'in_border' : null }` }
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
									errors={ upErrors.role ? upErrors.role.replaceAll('_', ' ') : null }
									value={ formData.role ? formData.role : singleUser?.role }
									title={ formData.role ? formData.role : singleUser?.role }
									vName={ 'name' }
									keyValue={ 'value' }
									onChange={ (event) => this.handleChangeValue('role', event.target.value) }
								/>
							</label>
							<label className="user__update_label">
								<InputRadio
									disabled={ !!singleUser?.deleted }
									label={ 'Verified' }
									first={ 'Yes' }
									second={ 'No' }
									firstValue={ true }
									secondValue={ false }
									value={ formData.verified ? formData.verified.toString() === 'true' : singleUser?.verified ? singleUser.verified : false }
									onChange={ (event) => this.handleChangeValue('verified', event.target.value) }
								/>
							</label>
							<label className="user__update_label">
								<p>Username</p><br/>
								<Input
									disabled={ !!singleUser?.deleted }
									size={ 'small' }
									className={ `user__update_input ${ formData.username && formData.username !== singleUser?.username
										? 'in_border' : null }` }
									type={ "text" }
									mask={ singleUser?.deleted ? null : "********************" }
									maskChar={ '' }
									errors={ upErrors.username ? upErrors.username.replaceAll('_', ' ') : null }
									placeholder={ "Username" }
									title={ formData.username ? formData.username : singleUser?.username }
									onChange={ (event) => this.handleChangeValue('username', event.target.value) }
									defaultValue={ singleUser?.username }/>
							</label>
							<label className="user__update_label">
								<p>FirstName</p><br/>
								<Input
									disabled={ !!singleUser?.deleted }
									className={ `user__update_input ${ formData.firstName && formData.firstName !== singleUser?.firstName
										? 'in_border' : null }` }
									size={ 'small' }
									name={ "firstName" }
									type={ "text" }
									mask={ singleUser?.deleted ? null : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
									maskChar={ '' }
									errors={ upErrors.firstName ? upErrors.firstName.replaceAll('_', ' ') : null }
									placeholder={ "FirstName" }
									title={ formData.firstName ? formData.firstName : singleUser?.firstName }
									onChange={ (event) => this.handleChangeValue('firstName', event.target.value) }
									defaultValue={ singleUser?.firstName }/>
							</label>
							<label className="user__update_label">
								<p>LastName</p><br/>
								<Input
									disabled={ !!singleUser?.deleted }
									className={ `user__update_input ${ formData.lastName && formData.lastName !== singleUser?.lastName
										? 'in_border' : null }` }
									size={ 'small' }
									name={ "lastName" }
									type={ "text" }
									mask={ singleUser?.deleted ? null : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
									maskChar={ '' }
									errors={ upErrors.lastName ? upErrors.lastName.replaceAll('_', ' ') : null }
									placeholder={ "LastName" }
									title={ formData.lastName ? formData.lastName : singleUser?.lastName }
									onChange={ (event) => this.handleChangeValue('lastName', event.target.value) }
									defaultValue={ singleUser?.lastName }/>
							</label>
							<label className="user__update_label">
								<p>Email</p><br/>
								<Input
									disabled={ !!singleUser?.deleted }
									size={ 'small' }
									className={ `user__update_input ${ formData.email && formData.email !== singleUser?.email
										? 'in_border' : null }` }
									type={ "email" }
									errors={ upErrors.email ? ErrorEnum[upErrors.email] ? ErrorEnum[upErrors.email]
										: upErrors.email.replaceAll('_', ' ') : null }
									placeholder={ "example@mail.com" }
									title={ formData.email ? formData.email : singleUser?.email }
									onChange={ (event) => this.handleChangeValue('email', event.target.value) }
									defaultValue={ singleUser?.email }/>
							</label>
							<p>
								Verify ID - { singleUser?.verifyId ? singleUser?.verifyId : <i>Empty</i> }
							</p>
							<br/>
							<label className="user__update_label">
								<p>Deleted</p><br/>
								<Selects
									size={ "small" }
									className={ `user__update_input ${ formData.deleted && formData.deleted !== singleUser?.deleted
										? 'in_border' : null }` }
									label={ singleUser?.deleted ? 'Yes' : 'No' }
									data={ [{value: true, name: 'Yes'}, {value: false, name: 'No'}] }
									errors={ upErrors.deleted ? upErrors.deleted.replaceAll('_', ' ') : null }
									value={ formData.deleted }
									title={ formData.deleted }
									vName={ 'name' }
									keyValue={ 'value' }
									onChange={ (event) => this.handleChangeValue('deleted', event.target.value) }
								/>
							</label>
							<div className="user__update_label">
								<div className="user__update_invitor">
									<span>Invitor -&ensp;</span>
									<div>
										<p>Id - { singleUser?.invite?.id }</p>
										<p>Username - { singleUser?.invite?.username }</p>
										<p>Name - { singleUser?.invite?.firstName } { singleUser?.invite?.lastName }</p>
									</div>
								</div>
							</div>
							<div onClick={ this.openRef } className="user__update_ref">Referrals - { singleUser?.userInvitor?.length }
								{ open ? <ArrowDropUp/> : <ArrowDropDown/> }
							</div>
							{ !open ? <><br/><br/><br/></> : null }
							{ open ? <div className="update__referrals">{ _.map(singleUser?.userInvitor, (v, k) => (
								<div key={ k } title={ v.id + ' - ' + (v.username || 'None') }><span>{ k + 1 }) </span>
									<Link to={ `/user_update/${ v.id }` } className="ref_id"
									      onClick={ () => {
										      this.props.getUser(v.id);
										      window.scrollTo(0, 0)
									      } }
									>
										{ v.id }
									</Link>
								</div>
							)) }</div> : null }
						</div>
						: <><br/><p className="center">{ singleUser ? 'loading...' : 'No such user' }</p></> }
					<Results/>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	singleUser: state.users.singleUser,
	usersStatus: state.users.usersStatus,
	userUpdate: state.users.userUpdate,
	userUpdateStatus: state.users.userUpdateStatus,
	upErrors: state.users.upError,
	myAccount: state.users.myAccount,
})

const mapDispatchToProps = {
	getUser,
	deletingUser,
	updateUser,
}

const UserUpdateContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UserUpdate)

export default UserUpdateContainer;
