import socket from "socket.io-client";
import Api from "../../../Api";

let io;

export const SOCKET_ACTIVE_USERS = 'SOCKET_ACTIVE_USERS';
export const SOCKET_ACTIVE_DRIVERS = 'SOCKET_ACTIVE_DRIVERS';
export const SOCKET_DELETE_DRIVER = 'SOCKET_DELETE_DRIVER';
export const GET_ACTIVE_DRIVERS = 'GET_ACTIVE_DRIVERS';
export const DELETE_ACTIVE_DRIVERS = 'DELETE_ACTIVE_DRIVERS';
export const NEW_COORDS = "NEW_COORDS"

export function socketInit(token) {
	return (dispatch) => {
		if (io){
			return;
		}
		io = socket(Api.url, {
			extraHeaders: {Authorization: `Bearer ${ token }`},
			withCredentials: true,
			autoConnect: true,
			pingInterval: 25000,
			pingTimeout: 180000,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 10000,
			reconnectionAttempts: 5,
			secure: true,
			path: '/socket.io',
		});

		io.on('unauthorized', (error, callback) => {
			if (error.data.type === 'UnauthorizedError' || error.data.code === 'invalid_token'){
				callback();
				console.log('User token has expired');
			}
		});

		io.on('active-users', (users) => {
			dispatch({
				type: SOCKET_ACTIVE_USERS,
				payload: {users},
			})
		});

		io.on('active-drivers', (drivers) => {
			dispatch({
				type: SOCKET_ACTIVE_DRIVERS,
				payload: {drivers},
			})
		});

		io.on('delete-driver', (id) => {
			dispatch({
				type: SOCKET_DELETE_DRIVER,
				payload: {id},
			})
		});

		io.on('new-coords', (data) => {
			dispatch({
				type: NEW_COORDS,
				payload: data,
			})
		})
	}
}

export function getActiveDrivers(data) {
	io.emit('get-drivers', data);
	return {
		type: "GET_ACTIVE_DRIVERS",
		payload: {data},
	}
}

export function deleteActiveDrivers() {
	return {
		type: "DELETE_ACTIVE_DRIVERS",
		payload: {},
	}
}
