import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const GET_TRANSPORTS = define('GET_TRANSPORTS');

export function getTransports(page, id, type, country, city, price) {
  return GET_TRANSPORTS.request(() => Api.getTransport(id, type, country, city, price, page)).takeLatest();
}

export const GET_TRANSPORT = define('GET_TRANSPORT');

export function getTransport(id) {
  return GET_TRANSPORT.request(() => Api.getSingleTransport(id)).takeLatest();
}

export const CREATE_TRANSPORT = define('CREATE_TRANSPORT');

export function createTransport(formData) {
  return CREATE_TRANSPORT.request(() => Api.postTransport(formData)).takeLatest();
}

export const UPDATE_TRANSPORT = define('UPDATE_TRANSPORT');

export function updateTransport(formData) {
  return UPDATE_TRANSPORT.request(() => Api.putTransport(formData)).takeLatest();
}

export const DELETE_TRANSPORT = define('DELETE_TRANSPORT');

export function delTransport(id) {
  return DELETE_TRANSPORT.request(() => Api.deleteTransport(id)).takeLatest();
}

export const DELETE_TRANSPORT_DATA = 'DELETE_TRANSPORT_DATA';

export function deleteTransportData() {
  return {
    type: DELETE_TRANSPORT_DATA,
    payload: {}
  }
}

