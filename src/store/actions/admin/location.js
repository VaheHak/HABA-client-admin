import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const CREATE_COUNTRY = define('CREATE_COUNTRY');

export function createCountry(formData) {
  return CREATE_COUNTRY.request(() => Api.postCountry(formData)).takeLatest();
}

export const CREATE_CITY = define('CREATE_CITY');

export function createCity(formData) {
  return CREATE_CITY.request(() => Api.postCity(formData)).takeLatest();
}

export const CREATE_ROUTE = define('CREATE_ROUTE');

export function createRoute(formData) {
  return CREATE_ROUTE.request(() => Api.postRoute(formData)).takeLatest();
}

export const GET_COUNTRY = define('GET_COUNTRY');

export function getCountries(page, sortKey, sort, i, s) {
  return GET_COUNTRY.request(() => Api.getCountry(page, sortKey, sort, i, s)).takeLatest();
}

export const GET_ONE_COUNTRY = define('GET_ONE_COUNTRY');

export function getCountry(id) {
  return GET_ONE_COUNTRY.request(() => Api.getSingleCountry(id)).takeLatest();
}

export const GET_CITY = define('GET_CITY');

export function getCities(page, sortKey, sort, i, s) {
  return GET_CITY.request(() => Api.getCity(page, sortKey, sort, i, s)).takeLatest();
}

export const GET_ONE_CITY = define('GET_ONE_CITY');

export function getOneCity(id) {
  return GET_ONE_CITY.request(() => Api.getSingleCity(id)).takeLatest();
}

export const GET_ROUTE = define('GET_ROUTE');

export function getRoutes(page, sortKey, sort, s) {
  return GET_ROUTE.request(() => Api.getRoute(page, sortKey, sort, s)).takeLatest();
}

export const UPDATE_COUNTRY = define('UPDATE_COUNTRY');

export function updateCountry(formData) {
  return UPDATE_COUNTRY.request(() => Api.putCountry(formData)).takeLatest();
}

export const UPDATE_CITY = define('UPDATE_CITY');

export function updateCity(formData) {
  return UPDATE_CITY.request(() => Api.putCity(formData)).takeLatest();
}

export const DELETE_COUNTRY = define('DELETE_COUNTRY');

export function deletingCountry(id) {
  return DELETE_COUNTRY.request(() => Api.deleteCountry(id)).takeLatest();
}

export const DELETE_CITY = define('DELETE_CITY');

export function deletingCity(id) {
  return DELETE_CITY.request(() => Api.deleteCity(id)).takeLatest();
}

export const DELETE_ROUTE = define('DELETE_ROUTE');

export function deletingRoute(id) {
  return DELETE_ROUTE.request(() => Api.deleteRoute(id)).takeLatest();
}

export const DELETE_COUNTRY_DATA = 'DELETE_COUNTRY_DATA';

export function deleteCountryData() {
  return {
    type: DELETE_COUNTRY_DATA,
    payload: {}
  }
}

