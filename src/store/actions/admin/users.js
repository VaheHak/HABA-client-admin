import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const PROFILE = define('PROFILE');

export function getAccount() {
  return PROFILE.request(() => Api.getProfile()).takeLatest();
}

export const LOGIN = define('LOGIN');

export function postLoginRequest(formData) {
  return LOGIN.request(() => Api.login(formData)).takeLatest();
}

export const LOGIN_CHECK = define('LOGIN_CHECK');

export function loginCheck(formData) {
  return LOGIN_CHECK.request(() => Api.checkLogin(formData)).takeLatest();
}

export const CREATE_USER = define('CREATE_USER');

export function createUser(formData) {
  return CREATE_USER.request(() => Api.postUser(formData)).takeLatest();
}

export const CREATE_DRIVER = define('CREATE_DRIVER');

export function createDriver(formData) {
  return CREATE_DRIVER.request(() => Api.postDriver(formData)).takeLatest();
}

export const CREATE_PARTNER = define('CREATE_PARTNER');

export function createPartner(formData, uploadProcess, cb) {
  return CREATE_PARTNER.request(() => Api.postPartner(formData, uploadProcess, cb)).takeLatest();
}

export const GET_ALL_USERS = define('GET_ALL_USERS');

export function getAllUsers(id, sortKey, sort, phoneNumber, username, firstName, lastName, email, verified, deleted, role, page) {
  return GET_ALL_USERS.request(() => Api.getUsers(id, phoneNumber, username, firstName, lastName, email, verified,
    deleted, role, sortKey, sort, page)).takeLatest();
}

export const GET_SELECT_USERS = define('GET_SELECT_USERS');

export function getSelectUsers(page, s) {
  return GET_SELECT_USERS.request(() => Api.selectUsers(page, s)).takeLatest();
}

export const GET_USER = define('GET_USER');

export function getUser(id) {
  return GET_USER.request(() => Api.getSingleUser(id)).takeLatest();
}

export const GET_DRIVERS = define('GET_DRIVERS');

export function getDrivers(page, id, make, model, color, year, passengersSeat, number, type, partner, sortKey, sort, i) {
  return GET_DRIVERS.request(() => Api.drivers(id, make, model, color, year, passengersSeat, number, type, partner, sortKey, sort, i, page)).takeLatest();
}

export const GET_SELECT_DRIVERS = define('GET_SELECT_DRIVERS');

export function getSelectDrivers(page, s, state) {
  return GET_SELECT_DRIVERS.request(() => Api.selectDrivers(page, s, state)).takeLatest();
}

export const GET_DRIVER = define('GET_DRIVER');

export function getDriver(id) {
  return GET_DRIVER.request(() => Api.driver(id)).takeLatest();
}

export const GET_PARTNER = define('GET_PARTNER');

export function getPartners(page, name, country, city, user, deliveryPrice, membershipPrice, lastMembershipPayment, nextMembershipPayment) {
  return GET_PARTNER.request(() => Api.partners(country, city, name, user, deliveryPrice, membershipPrice,
    lastMembershipPayment, nextMembershipPayment, page)).takeLatest();
}

export const GET_SINGLE_PARTNER = define('GET_SINGLE_PARTNER');

export function getOnePartner(id) {
  return GET_SINGLE_PARTNER.request(() => Api.getSinglePartner(id)).takeLatest();
}

export const GET_BRANCHES = define('GET_BRANCHES');

export function getBranches(partnerId) {
  return GET_BRANCHES.request(() => Api.branches(partnerId)).takeLatest();
}

export const UPDATE_USER = define('UPDATE_USER');

export function updateUser(formData) {
  return UPDATE_USER.request(() => Api.putUser(formData)).takeLatest();
}

export const UPDATE_DRIVER = define('UPDATE_DRIVER');

export function updateDriver(formData) {
  return UPDATE_DRIVER.request(() => Api.putDriver(formData)).takeLatest();
}

export const UPDATE_PARTNER = define('UPDATE_PARTNER');

export function updatePartner(formData, uploadProcess, cb) {
  return UPDATE_PARTNER.request(() => Api.putPartner(formData, uploadProcess, cb)).takeLatest();
}

export const DELETE_USER = define('DELETE_USER');

export function deletingUser(id) {
  return DELETE_USER.request(() => Api.deleteUser(id)).takeLatest();
}

export const DELETE_DRIVER = define('DELETE_DRIVER');

export function deletingDriver(id) {
  return DELETE_DRIVER.request(() => Api.deleteDriver(id)).takeLatest();
}

export const DELETE_PARTNER = define('DELETE_PARTNER');

export function deletingPartner(id) {
  return DELETE_PARTNER.request(() => Api.deletePartner(id)).takeLatest();
}

export const USER_TOKEN_DELETE = 'USER_TOKEN_DELETE';

export function deleteToken() {
  return {
    type: USER_TOKEN_DELETE,
    payload: {}
  }
}

export const BACK_TO_LOGIN = 'BACK_TO_LOGIN';

export function backToLogin() {
  return {
    type: BACK_TO_LOGIN,
    payload: {}
  }
}

export const DELETE_USER_DATA = 'DELETE_USER_DATA';

export function deleteUserData() {
  return {
    type: DELETE_USER_DATA,
    payload: {}
  }
}

