import * as deliveryAction from "../../actions/admin/delivery";

const initialState = {
	orderStatus: '',
	orders: [],
	ordersErr: {},
	order: {},
	orderErr: {},
	createStatus: '',
	createOrder: [],
	createOrderErr: {},
	updateStatus: '',
	updateOrder: [],
	updateOrderErr: {},
	deleteStatus: '',
	deleteOrder: [],
	deleteOrderErr: {},
}

export default function reducer(state = initialState, action) {

	switch ( action.type ) {
		case deliveryAction.GET_ORDERS.REQUEST: {
			return {
				...state,
				orderStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDERS.SUCCESS: {
			return {
				...state,
				orderStatus: 'success',
				orders: action.payload.data.data,
				ordersErr: {},
			}
		}
		case deliveryAction.GET_ORDERS.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				orderStatus: 'fail',
				ordersErr: data.message,
			}
		}

		case deliveryAction.GET_ORDER.REQUEST: {
			return {
				...state,
				orderStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDER.SUCCESS: {
			return {
				...state,
				orderStatus: 'success',
				order: action.payload.data.data,
				orderErr: {},
			}
		}
		case deliveryAction.GET_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				orderStatus: 'fail',
				orderErr: data.message,
			}
		}

		case deliveryAction.CREATE_ORDER.REQUEST: {
			return {
				...state,
				createStatus: 'request',
			}
		}
		case deliveryAction.CREATE_ORDER.SUCCESS: {
			return {
				...state,
				createStatus: 'success',
				createOrder: action.payload.data,
				createOrderErr: {},
			}
		}
		case deliveryAction.CREATE_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				createStatus: 'fail',
				createOrderErr: data.message,
			}
		}

		case deliveryAction.UPDATE_ORDER.REQUEST: {
			return {
				...state,
				updateStatus: 'request',
			}
		}
		case deliveryAction.UPDATE_ORDER.SUCCESS: {
			return {
				...state,
				updateStatus: 'success',
				updateOrder: action.payload.data,
				updateOrderErr: {},
			}
		}
		case deliveryAction.UPDATE_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				updateStatus: 'fail',
				updateOrderErr: data.message,
			}
		}

		case deliveryAction.DELETE_ORDER.REQUEST: {
			return {
				...state,
				deleteStatus: 'request',
			}
		}
		case deliveryAction.DELETE_ORDER.SUCCESS: {
			return {
				...state,
				deleteStatus: 'success',
				deleteOrder: action.payload.data,
				deleteOrderErr: {},
			}
		}
		case deliveryAction.DELETE_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				deleteStatus: 'fail',
				deleteOrderErr: data.message,
			}
		}

		case deliveryAction.DELETE_DELIVERY_DATA: {
			return {
				...state,
				ordersErr: {},
				createStatus: '',
				createOrder: [],
				createOrderErr: {},
				updateStatus: '',
				updateOrder: [],
				updateOrderErr: {},
				deleteStatus: '',
				deleteOrder: [],
				deleteOrderErr: {},
			}
		}

		default: {
			return state;
		}
	}
}
