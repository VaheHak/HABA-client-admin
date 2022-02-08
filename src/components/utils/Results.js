import React, { Component } from 'react';
import ResInfo from "./ResInfo";
import { connect } from "react-redux";
import { deleteUserData } from "../../store/actions/admin/users";
import { deleteCountryData } from "../../store/actions/admin/location";
import { deleteServiceData } from "../../store/actions/admin/service";
import { deleteTransportData } from "../../store/actions/admin/transport";
import { deleteDeliveryData } from "../../store/actions/admin/delivery";
import _ from "lodash";
import ErrorEnum from "../../helpers/ErrorHandler";
import { withRouter } from "react-router-dom";

class Results extends Component {

	render() {
		const {
			userUpdate, userDelete, userCreate, countryCreate, countryUpdate, countryDelete, cityCreate, cityUpdate,
			cityDelete, routeCreate, routeDelete, driverCreate, driverUpdate, driverDelete, ticketCreate, ticketUpdate,
			ticketDelete, serviceCreate, serviceUpdate, serviceDelete, passengerDelete, partnerCreate, partnerUpdate,
			partnerDelete, transportCreate, transportUpdate, transportDelete, createOrder, updateOrder, deleteOrder,
		} = this.props;

		return (
			<>
				<ResInfo value={ userUpdate.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ userUpdate.status === true ? 'success' : userUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[userUpdate.message] ? ErrorEnum[userUpdate.message] : userUpdate.message }/>
				<ResInfo value={ userDelete.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ userDelete.status === true ? 'success' : userDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[userDelete.message] ? ErrorEnum[userDelete.message] : userDelete.message }/>
				<ResInfo value={ userCreate.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ userCreate.status === true ? 'success' : userCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[userCreate.message] ? ErrorEnum[userCreate.message] : userCreate.message }/>
				<ResInfo value={ countryCreate.message ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ countryCreate.status === true ? 'success' : countryCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[countryCreate.message] ? ErrorEnum[countryCreate.message] : countryCreate.message }/>
				<ResInfo value={ countryUpdate.message ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ countryUpdate.status === true ? 'success' : countryUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[countryUpdate.message] ? ErrorEnum[countryUpdate.message] : countryUpdate.message }/>
				<ResInfo value={ countryDelete.message ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ countryDelete.status === true ? 'success' : countryDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[countryDelete.message] ? ErrorEnum[countryDelete.message] : countryDelete.message }/>
				<ResInfo value={ cityCreate.message ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ cityCreate.status === true ? 'success' : cityCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[cityCreate.message] ? ErrorEnum[cityCreate.message] : cityCreate.message }/>
				<ResInfo value={ cityUpdate.message ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ cityUpdate.status === true ? 'success' : cityUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[cityUpdate.message] ? ErrorEnum[cityUpdate.message] : cityUpdate.message }/>
				<ResInfo value={ cityDelete.message ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ cityDelete.status === true ? 'success' : cityDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[cityDelete.message] ? ErrorEnum[cityDelete.message] : cityDelete.message }/>
				<ResInfo value={ routeCreate.status ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ routeCreate.status === true ? 'success' : routeCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[routeCreate.message] ? ErrorEnum[routeCreate.message] : routeCreate.message }/>
				<ResInfo value={ routeDelete.message ? 'on' : null } successFunc={ this.props.deleteCountryData }
				         res={ routeDelete.status === true ? 'success' : routeDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[routeDelete.message] ? ErrorEnum[routeDelete.message] : routeDelete.message }
				         msg2={ routeDelete.data ? _.map(routeDelete.data, (v) => {
					         return 'Id - ' + v.id + ' | ';
				         }) : null }/>
				<ResInfo value={ driverCreate.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ driverCreate.status === true ? 'success' : driverCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[driverCreate.message] ? ErrorEnum[driverCreate.message] : driverCreate.message }
				         msg2={ driverCreate.data ? _.isString(driverCreate.data) ? driverCreate.data : _.map(driverCreate.data, (v) => {
					         if (typeof v === 'object'){
						         _.map(v, (d) => {
							         return d?.id + ' | '
						         })
					         }
					         if (typeof +v === 'number'){
						         return v + ' | ';
					         }
				         }) : null }/>
				<ResInfo value={ driverUpdate.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ driverUpdate.status === true ? 'success' : driverUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[driverUpdate.message] ? ErrorEnum[driverUpdate.message] : driverUpdate.message }
				         msg2={ driverUpdate.data ? _.isString(driverUpdate.data) ? driverUpdate.data : _.map(driverUpdate.data, (v) => {
					         if (typeof v === 'object'){
						         _.map(v, (d) => {
							         return d?.id + ' | '
						         })
					         }
					         if (typeof +v === 'number'){
						         return v + ' | ';
					         }
				         }) : null }/>
				<ResInfo value={ driverDelete.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ driverDelete.status === true ? 'success' : driverDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[driverDelete.message] ? ErrorEnum[driverDelete.message] : driverDelete.message }/>
				<ResInfo value={ ticketCreate.message ? 'on' : null } successFunc={ this.props.deleteServiceData }
				         res={ ticketCreate.status === true ? 'success' : ticketCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[ticketCreate.message] ? ErrorEnum[ticketCreate.message] : ticketCreate.message }
				         msg2={ ticketCreate.data && _.isString(ticketCreate.data) ? 'Id - ' + ticketCreate.data : null }/>
				<ResInfo value={ ticketUpdate.message ? 'on' : null } successFunc={ this.props.deleteServiceData }
				         res={ ticketUpdate.status === true ? 'success' : ticketUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[ticketUpdate.message] ? ErrorEnum[ticketUpdate.message] : ticketUpdate.message }
				         msg2={ ticketUpdate.data && _.isString(ticketUpdate.data) ? 'Id - ' + ticketUpdate.data : null }/>
				<ResInfo value={ ticketDelete.message ? 'on' : null } successFunc={ this.props.deleteServiceData }
				         res={ ticketDelete.status === true ? 'success' : ticketDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[ticketDelete.message] ? ErrorEnum[ticketDelete.message] : ticketDelete.message }/>
				<ResInfo value={ serviceCreate.message ? 'on' : null } successFunc={ this.props.deleteServiceData }
				         res={ serviceCreate.status === true ? 'success' : serviceCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[serviceCreate.message] ? ErrorEnum[serviceCreate.message] : serviceCreate.message }/>
				<ResInfo value={ serviceUpdate.message ? 'on' : null } successFunc={ this.props.deleteServiceData }
				         res={ serviceUpdate.status === true ? 'success' : serviceUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[serviceUpdate.message] ? ErrorEnum[serviceUpdate.message] : serviceUpdate.message }/>
				<ResInfo value={ serviceDelete.message ? 'on' : null } successFunc={ this.props.deleteServiceData }
				         res={ serviceDelete.status === true ? 'success' : serviceDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[serviceDelete.message] ? ErrorEnum[serviceDelete.message] : serviceDelete.message }
				         msg2={ serviceDelete.data ? _.map(serviceDelete.data, (v) => {
					         return 'Id - ' + v.id + ', ';
				         }) : null }/>
				<ResInfo value={ passengerDelete.message ? 'on' : null } successFunc={ this.props.deleteServiceData }
				         res={ passengerDelete.status === true ? 'success' : passengerDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[passengerDelete.message] ? ErrorEnum[passengerDelete.message] : passengerDelete.message }
				         msg2={ passengerDelete.data ? 'Status - ' + !!passengerDelete.data : null }/>
				<ResInfo value={ partnerCreate.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ partnerCreate.status === true ? 'success' : partnerCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[partnerCreate.message] ? ErrorEnum[partnerCreate.message] : partnerCreate.message }
				         msg2={ partnerCreate.data ? _.isString(partnerCreate.data) ? partnerCreate.data : _.map(partnerCreate.data, (v) => {
					         if (typeof v === 'object'){
						         _.map(v, (d) => {
							         if (typeof d !== 'object') return d?.id ? d?.id + ' | ' : ''
						         })
					         }
					         if (typeof +v === 'number'){
						         return v + ' | ';
					         }
				         }) : null }/>
				<ResInfo value={ partnerUpdate.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ partnerUpdate.status === true ? 'success' : partnerUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[partnerUpdate.message] ? ErrorEnum[partnerUpdate.message] : partnerUpdate.message }
				         msg2={ partnerUpdate.data ? _.isString(partnerUpdate.data) ? partnerUpdate.data : _.map(partnerUpdate.data, (v) => {
					         if (typeof v === 'object'){
						         _.map(v, (d) => {
							         return d?.id ? d?.id + ' | ' : ''
						         })
					         }
					         if (typeof +v === 'number'){
						         return v + ' | ';
					         }
				         }) : null }/>
				<ResInfo value={ partnerDelete.message ? 'on' : null } successFunc={ this.props.deleteUserData }
				         res={ partnerDelete.status === true ? 'success' : partnerDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[partnerDelete.message] ? ErrorEnum[partnerDelete.message] : partnerDelete.message }/>
				<ResInfo value={ transportCreate.message ? 'on' : null } successFunc={ this.props.deleteTransportData }
				         res={ transportCreate.status === true ? 'success' : transportCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[transportCreate.message] ? ErrorEnum[transportCreate.message] : transportCreate.message }/>
				<ResInfo value={ transportUpdate.message ? 'on' : null } successFunc={ this.props.deleteTransportData }
				         res={ transportUpdate.status === true ? 'success' : transportUpdate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[transportUpdate.message] ? ErrorEnum[transportUpdate.message] : transportUpdate.message }/>
				<ResInfo value={ transportDelete.message ? 'on' : null } successFunc={ this.props.deleteTransportData }
				         res={ transportDelete.status === true ? 'success' : transportDelete.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[transportDelete.message] ? ErrorEnum[transportDelete.message] : transportDelete.message }/>
				<ResInfo value={ createOrder.message ? 'on' : null } successFunc={ this.props.deleteDeliveryData }
				         res={ createOrder.status === true ? 'success' : createOrder.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[createOrder.message] ? ErrorEnum[createOrder.message] : createOrder.message }/>
				<ResInfo value={ updateOrder.message ? 'on' : null } successFunc={ this.props.deleteDeliveryData }
				         res={ updateOrder.status === true ? 'success' : updateOrder.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[updateOrder.message] ? ErrorEnum[updateOrder.message] : updateOrder.message }/>
				<ResInfo value={ deleteOrder.message ? 'on' : null } successFunc={ this.props.deleteDeliveryData }
				         res={ deleteOrder.status === true ? 'success' : deleteOrder.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[deleteOrder.message] ? ErrorEnum[deleteOrder.message] : deleteOrder.message }/>
			</>
		);
	}
}

const mapStateToProps = (state) => ({
	userUpdate: state.users.userUpdate,
	userDelete: state.users.userDelete,
	userCreate: state.users.userCreate,
	countryCreate: state.location.countryCreate,
	countryUpdate: state.location.countryUpdate,
	countryDelete: state.location.countryDelete,
	cityCreate: state.location.cityCreate,
	cityUpdate: state.location.cityUpdate,
	cityDelete: state.location.cityDelete,
	routeCreate: state.location.routeCreate,
	routeDelete: state.location.routeDelete,
	driverCreate: state.users.driverCreate,
	driverUpdate: state.users.driverUpdate,
	driverDelete: state.users.driverDelete,
	serviceCreate: state.service.serviceCreate,
	serviceUpdate: state.service.serviceUpdate,
	serviceDelete: state.service.serviceDelete,
	ticketCreate: state.service.ticketCreate,
	ticketUpdate: state.service.ticketUpdate,
	ticketDelete: state.service.ticketDelete,
	passengerDelete: state.service.passengerDelete,
	partnerCreate: state.users.partnerCreate,
	partnerUpdate: state.users.partnerUpdate,
	partnerDelete: state.users.partnerDelete,
	transportCreate: state.transport.transportCreate,
	transportUpdate: state.transport.transportUpdate,
	transportDelete: state.transport.transportDelete,
	createOrder: state.delivery.createOrder,
	updateOrder: state.delivery.updateOrder,
	deleteOrder: state.delivery.deleteOrder,
})

const mapDispatchToProps = {
	deleteUserData,
	deleteCountryData,
	deleteServiceData,
	deleteTransportData,
	deleteDeliveryData,
}

const ResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Results)

export default withRouter(ResultsContainer);
