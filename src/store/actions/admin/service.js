import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const CREATE_SERVICE = define('CREATE_SERVICE');

export function createService(formData) {
  return CREATE_SERVICE.request(() => Api.postService(formData)).takeLatest();
}

export const CREATE_TICKET = define('CREATE_TICKET');

export function createTicket(formData) {
  return CREATE_TICKET.request(() => Api.postTicket(formData)).takeLatest();
}

export const GET_SERVICE = define('GET_SERVICE');

export function getServices(page, id, toStartDate, fromStartDate, state, type, availableCount,
                            ticketPriceRange, ticket, user, route, sort) {
  return GET_SERVICE.request(() => Api.getService(id, toStartDate, fromStartDate, state, type, availableCount,
    ticketPriceRange, ticket, user, route, sort, page)).takeLatest();
}

export const GET_ONE_SERVICE = define('GET_ONE_SERVICE');

export function getService(id) {
  return GET_ONE_SERVICE.request(() => Api.getSingleService(id)).takeLatest();
}

export const GET_TICKET = define('GET_TICKET');

export function getTickets(page, id, toStartDate, fromStartDate, status, user) {
  return GET_TICKET.request(() => Api.getTicket(id, toStartDate, fromStartDate, status, user, page)).takeLatest();
}

export const GET_ONE_TICKET = define('GET_ONE_TICKET');

export function getOneTicket(id) {
  return GET_ONE_TICKET.request(() => Api.getSingleTicket(id)).takeLatest();
}

export const UPDATE_SERVICE = define('UPDATE_SERVICE');

export function updateService(formData) {
  return UPDATE_SERVICE.request(() => Api.putService(formData)).takeLatest();
}

export const UPDATE_TICKET = define('UPDATE_TICKET');

export function updateTicket(formData) {
  return UPDATE_TICKET.request(() => Api.putTicket(formData)).takeLatest();
}

export const DELETE_SERVICE = define('DELETE_SERVICE');

export function deletingService(id) {
  return DELETE_SERVICE.request(() => Api.deleteService(id)).takeLatest();
}

export const DELETE_TICKET = define('DELETE_TICKET');

export function deletingTicket(id) {
  return DELETE_TICKET.request(() => Api.deleteTicket(id)).takeLatest();
}

export const DELETE_PASSENGER = define('DELETE_PASSENGER');

export function deletingTicketDetail(id, detailsId, type) {
  return DELETE_PASSENGER.request(() => Api.deleteTicketDetail(id, detailsId, type)).takeLatest();
}

export const DELETE_SERVICE_DATA = 'DELETE_SERVICE_DATA';

export function deleteServiceData() {
  return {
    type: DELETE_SERVICE_DATA,
    payload: {}
  }
}
