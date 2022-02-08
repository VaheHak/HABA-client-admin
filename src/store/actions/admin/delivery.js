import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const GET_ORDERS = define('GET_ORDERS');

export function getDeliveryOrders(partner, branchId, page, endDate, startDate, address, status) {
	return GET_ORDERS.request(() => Api.orders(page, partner, branchId, endDate, startDate, address, status)).takeLatest();
}

export const GET_ORDER = define('GET_ORDER');

export function getDeliveryOrder(id) {
	return GET_ORDER.request(() => Api.order(id)).takeLatest();
}

export const CREATE_ORDER = define('CREATE_ORDER');

export function createOrder(formData) {
	return CREATE_ORDER.request(() => Api.postOrder(formData)).takeLatest();
}

export const UPDATE_ORDER = define('UPDATE_ORDER');

export function updateOrder(formData) {
	return UPDATE_ORDER.request(() => Api.putOrder(formData)).takeLatest();
}

export const DELETE_ORDER = define('DELETE_ORDER');

export function deleteOrder(id) {
	return DELETE_ORDER.request(() => Api.deleteOrder(id)).takeLatest();
}

export const DELETE_DELIVERY_DATA = 'DELETE_DELIVERY_DATA';

export function deleteDeliveryData() {
	return {
		type: DELETE_DELIVERY_DATA,
		payload: {}
	}
}

