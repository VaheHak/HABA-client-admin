import axios from 'axios';
import Storage from './helpers/Account'
import toFormData from "object-to-formdata";

const {REACT_APP_API_KEY, REACT_APP_API_URL} = process.env;

const api = axios.create({
	baseURL: REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
	const token = Storage.getToken();
	if (token){
		config.headers.Authorization = token
	}
	config.headers['X-API-KEY'] = REACT_APP_API_KEY;
	return config;
}, (error) => {
	return Promise.reject(error);
})

api.interceptors.response.use((response) => {
		return response;
	}, async (error) => {
		const originalRequest = error.config;
		const refreshToken = Storage.getResetToken();
		if (refreshToken && error.response && error.response.status === 401 && !originalRequest._retry){
			originalRequest._retry = true;
			try {
				const res = await api.post("/reset/token", {refreshToken});
				if (res.status === 200){
					const {data} = res.data;
					Storage.setToken(data);
					window.location.reload();
					return api(originalRequest);
				}
			} catch (_error) {
				return Promise.reject(_error);
			}
		}
		return Promise.reject(error);
	}
);

class Api {
	static url = REACT_APP_API_URL;

	//admin
	static getProfile() {
		return api.get(`/profile`);
	}

	static login(formData) {
		return api.post(`/admin/login`, formData);
	}

	static checkLogin(formData) {
		return api.post(`/admin/checkAdminLogin`, formData);
	}

	static postUser(formData) {
		return api.post(`/user`, formData);
	}

	static postDriver(formData) {
		return api.post(`/user/driver`, formData);
	}

	static postPartner(formData, uploadProcess) {
		return api.post(`/partner`, toFormData.serialize(formData, {indices: true}), {
			onUploadProgress: uploadProcess,
		});
	}

	static getUsers(id, phoneNumber, username, firstName, lastName, email, verified, deleted, role, sortKey, sort, page) {
		return api.get(`/user`, {
			params: {id, phoneNumber, username, firstName, lastName, email, verified, deleted, role, sortKey, sort, page}
		});
	}

	static selectUsers(page, s) {
		return api.get(`/user`, {
			params: {page, deleted: [0], role: 4, s}
		});
	}

	static getSingleUser(id) {
		return api.get(`/single_user`, {
			params: {id}
		});
	}

	static drivers(id, make, model, color, year, passengersSeat, number, type, partner, sortKey, sort, i, page) {
		return api.get(`/user/driver`, {
			params: {id, make, model, color, year, passengersSeat, number, type, partner, sortKey, sort, i, page}
		});
	}

	static selectDrivers(page, s, state) {
		return api.get(`/user/driver`, {
			params: {page, state: state ? void 0 : 1, s, type: state ? 2 : void 0}
		});
	}

	static driver(id) {
		return api.get(`/user/single/driver`, {
			params: {id}
		});
	}

	static partners(country, city, name, user, deliveryPrice, membershipPrice, lastMembershipPayment, nextMembershipPayment, page) {
		return api.get(`/partner`, {
			params: {
				country, city, name, user, deliveryPrice, membershipPrice,
				lastMembershipPayment, nextMembershipPayment, page,
			}
		});
	}

	static getSinglePartner(id) {
		return api.get(`/single/partner`, {
			params: {id}
		});
	}

	static branches(partnerId) {
		return api.get(`/partner/branches`, {
			params: {partnerId}
		});
	}

	static putUser(formData) {
		return api.put(`/user`, formData);
	}

	static putDriver(formData) {
		return api.put(`/user/driver`, formData);
	}

	static putPartner(formData, uploadProcess) {
		return api.put(`/partner`, toFormData.serialize(formData, {indices: true}), {
			onUploadProgress: uploadProcess,
		});
	}

	static deleteUser(id) {
		return api.delete(`/user/${ id }`);
	}

	static deleteDriver(id) {
		return api.delete(`/user/driver/${ id }`);
	}

	static deletePartner(id) {
		return api.delete(`/partner/${ id }`);
	}

	//location
	static postCountry(formData) {
		return api.post(`/country`, formData);
	}

	static postCity(formData) {
		return api.post(`/city`, formData);
	}

	static postRoute(formData) {
		return api.post(`/route`, formData);
	}

	static getCountry(page, sortKey, sort, i, s) {
		return api.get(`/country`, {
			params: {page, sortKey, sort, i, s}
		});
	}

	static getSingleCountry(id) {
		return api.get(`/single_country`, {
			params: {id}
		});
	}

	static getCity(page, sortKey, sort, i, s) {
		return api.get(`/city`, {
			params: {page, sortKey, sort, i, s}
		});
	}

	static getSingleCity(id) {
		return api.get(`/single_city`, {
			params: {id}
		});
	}

	static getRoute(page, sortKey, sort, s) {
		return api.get(`/route`, {
			params: {page, sortKey, sort, s}
		});
	}

	static putCountry(formData) {
		return api.put(`/country`, formData);
	}

	static putCity(formData) {
		return api.put(`/city`, formData);
	}

	static deleteCountry(id) {
		return api.delete(`/country/${ id }`);
	}

	static deleteCity(id) {
		return api.delete(`/city/${ id }`);
	}

	static deleteRoute(id) {
		return api.delete(`/route/${ id }`);
	}

	//service
	static postService(formData) {
		return api.post(`/service`, formData);
	}

	static postTicket(formData) {
		return api.post(`/ticket`, formData);
	}

	static getService(id, toStartDate, fromStartDate, state, type, availableCount,
	                  ticketPriceRange, ticket, user, route, sort, page) {
		return api.get(`/service`, {
			params: {
				id, toStartDate, fromStartDate, state, type, availableCount,
				ticketPriceRange, ticket, user, route, sort, page
			}
		});
	}

	static getSingleService(id) {
		return api.get(`/single/service`, {
			params: {id}
		});
	}

	static getTicket(id, toStartDate, fromStartDate, status, user, page) {
		return api.get(`/ticket`, {
			params: {id, toStartDate, fromStartDate, status, user, page}
		});
	}

	static getSingleTicket(id) {
		return api.get(`/single/ticket`, {
			params: {id}
		});
	}

	static putService(formData) {
		return api.put(`/service`, formData);
	}

	static putTicket(formData) {
		return api.put(`/ticket`, formData);
	}

	static deleteService(id) {
		return api.delete(`/service/${ id }`);
	}

	static deleteTicket(id) {
		return api.delete(`/ticket/${ id }`);
	}

	static deleteTicketDetail(id, detailsId, type) {
		return api.delete(`/ticket_detail/${ id }`, {
			params: {detailsId, type}
		});
	}

	//statistics
	static getStatistics(toStartDate, fromStartDate, cargoToStartDate, cargoFromStartDate) {
		return api.get(`/statistics`, {
			params: {toStartDate, fromStartDate, cargoToStartDate, cargoFromStartDate}
		});
	}

	//transport
	static getTransport(id, type, country, city, price, page) {
		return api.get(`/delivery/transports`, {
			params: {id, type, country, city, price, page}
		});
	}

	static getSingleTransport(id) {
		return api.get(`/delivery/transport`, {params: {id}});
	}

	static postTransport(formData) {
		return api.post(`/delivery/transport`, formData);
	}

	static putTransport(formData) {
		return api.put(`/delivery/transport`, formData);
	}

	static deleteTransport(id) {
		return api.delete(`/delivery/transport/${ id }`);
	}

	//Delivery
	static orders(page, partner, branchId, endDate, startDate, address, status) {
		return api.get(`/delivery/services`, {
			params: {page, partner, branchId, endDate, startDate, address, status}
		});
	}

	static order(id) {
		return api.get(`/delivery/service`, {
			params: {id}
		});
	}

	static postOrder(formData) {
		return api.post(`/delivery/service`, formData);
	}

	static putOrder(formData) {
		return api.put(`/delivery/service`, formData);
	}

	static deleteOrder(id) {
		return api.delete(`/delivery/service/${ id }`);
	}

}

export default Api;
