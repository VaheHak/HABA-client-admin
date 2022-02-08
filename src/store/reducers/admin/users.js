import * as userAction from "../../actions/admin/users";
import Account from '../../../helpers/Account';
import {
	DELETE_ACTIVE_DRIVERS,
	NEW_COORDS,
	SOCKET_ACTIVE_DRIVERS,
	SOCKET_ACTIVE_USERS,
	SOCKET_DELETE_DRIVER
} from "../../actions/admin/socket";
import _ from "lodash";

const initialState = {
	requestStatus: '',
	token: Account.getToken(),
	resetToken: Account.getResetToken(),
	errors: {},
	checkErrors: {},
	userGetError: {},
	upError: {},
	createError: {},
	loginData: {},
	allUsers: {},
	allDrivers: {},
	allPartners: {},
	userCreate: {},
	driverCreate: {},
	partnerCreate: {},
	userUpdate: {},
	driverUpdate: {},
	partnerUpdate: {},
	userDelete: {},
	driverDelete: {},
	partnerDelete: {},
	checkStatus: {},
	usersStatus: '',
	driversStatus: '',
	partnersStatus: '',
	userCreateStatus: '',
	driverCreateStatus: '',
	partnerCreateStatus: '',
	userUpdateStatus: '',
	driverUpdateStatus: '',
	partnerUpdateStatus: '',
	userDeleteStatus: '',
	driverDeleteStatus: '',
	partnerDeleteStatus: '',
	driverCreateErr: {},
	driverUpdateErr: {},
	driverGetError: {},
	partnerGetError: {},
	profileStatus: '',
	myAccount: {},
	myAccountErrors: {},
	singleUser: {},
	driver: {},
	partner: {},
	partnerCreateErr: {},
	partnerUpdateErr: {},
	branches: [],
	branchesErr: {},
	activeUsers: [],
	activeDrivers: [],
	activeDriversData: {},
	coordsList: [],
}

export default function reducer(state = initialState, action) {

	switch ( action.type ) {
		case SOCKET_ACTIVE_USERS: {
			const {users: activeUsers} = action.payload;
			return {
				...state,
				activeUsers,
			}
		}
		case SOCKET_ACTIVE_DRIVERS: {
			const {drivers: activeDrivers} = action.payload;
			return {
				...state,
				activeDrivers: _.uniqBy([...state.activeDrivers, ...activeDrivers?.array || []], "id"),
				activeDriversData: activeDrivers,
			}
		}
		case SOCKET_DELETE_DRIVER: {
			const {id} = action.payload;
			return {
				...state,
				activeDrivers: _.dropWhile(state.activeDrivers, ['id', +id]),
			}
		}
		case DELETE_ACTIVE_DRIVERS: {
			return {
				...state,
				activeDrivers: [],
				activeDriversData: {},
			}
		}
		case NEW_COORDS: {
			const oldCoords = state.coordsList;
			const newCoords = oldCoords.filter((item) => +item.driverId !== +action?.payload?.driverId)
			return {
				...state,
				coordsList: [...newCoords, action.payload],
			}
		}

		case userAction.PROFILE.REQUEST: {
			return {
				...state,
				myAccount: {},
				profileStatus: 'request',
			}
		}
		case userAction.PROFILE.SUCCESS: {
			return {
				...state,
				profileStatus: 'success',
				myAccount: action.payload.data.data,
				myAccountErrors: {},
			}
		}
		case userAction.PROFILE.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				profileStatus: 'fail',
				myAccountErrors: data.message,
			}
		}

		case userAction.LOGIN.REQUEST: {
			return {
				...state,
				loginData: '',
				myAccount: {},
				requestStatus: 'request',
			}
		}
		case userAction.LOGIN.SUCCESS: {
			return {
				...state,
				requestStatus: 'success',
				loginData: action.payload.data,
				errors: '',
			}
		}
		case userAction.LOGIN.FAIL: {
			const {data} = action.payload;
			if (data.message.phoneNumber){
				return {
					...state,
					requestStatus: 'fail',
					errors: data.message,
				}
			} else{
				return {
					...state,
					requestStatus: 'fail',
					errors: {
						message: data.message
					}
				}
			}
		}

		case userAction.LOGIN_CHECK.REQUEST: {
			return {
				...state,
				token: '',
				requestStatus: 'request',
			}
		}
		case userAction.LOGIN_CHECK.SUCCESS: {
			const {data} = action.payload.data;
			if (data){
				Account.setToken(data['access_token']);
				Account.setResetToken(data['refresh_token']);
			}
			return {
				...state,
				requestStatus: 'success',
				token: data !== null && data['access_token'] ? data['access_token'] : '',
				resetToken: data !== null && data['refresh_token'] ? data['refresh_token'] : '',
				checkStatus: action.payload.data,
				checkErrors: '',
			}
		}
		case userAction.LOGIN_CHECK.FAIL: {
			const {data} = action.payload;
			if (data.message.code || data.message.phoneNumber){
				return {
					...state,
					requestStatus: 'fail',
					checkErrors: data.message,
				}
			} else{
				return {
					...state,
					requestStatus: 'fail',
					checkErrors: {
						message: data.message
					}
				}
			}
		}

		case userAction.GET_ALL_USERS.REQUEST: {
			return {
				...state,
				usersStatus: 'request',
				userGetError: {},
				upError: {},
				createError: {},
			}
		}
		case userAction.GET_ALL_USERS.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				usersStatus: 'success',
				allUsers: data,
			}
		}
		case userAction.GET_ALL_USERS.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				usersStatus: 'fail',
				userGetError: message,
			}
		}

		case userAction.GET_SELECT_USERS.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				usersStatus: 'success',
				allUsers: data,
			}
		}
		case userAction.GET_SELECT_USERS.FAIL: {
			return {
				...state,
				usersStatus: 'fail',
			}
		}

		case userAction.GET_USER.REQUEST: {
			return {
				...state,
				usersStatus: 'request',
				upError: {},
				singleUser: {},
			}
		}
		case userAction.GET_USER.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				usersStatus: 'success',
				singleUser: data,
			}
		}

		case userAction.GET_DRIVERS.REQUEST: {
			return {
				...state,
				driversStatus: 'request',
				allDrivers: {},
			}
		}
		case userAction.GET_DRIVERS.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				driversStatus: 'success',
				allDrivers: data,
				driverGetError: {},
			}
		}
		case userAction.GET_DRIVERS.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				driversStatus: 'fail',
				driverGetError: message,
			}
		}

		case userAction.GET_SELECT_DRIVERS.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				driversStatus: 'success',
				allDrivers: data,
			}
		}
		case userAction.GET_SELECT_DRIVERS.FAIL: {
			return {
				...state,
				driversStatus: 'fail',
			}
		}

		case userAction.GET_DRIVER.REQUEST: {
			return {
				...state,
				driversStatus: 'request',
				driver: {},
				driverUpdateErr: {}
			}
		}
		case userAction.GET_DRIVER.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				driversStatus: 'success',
				driver: data,
			}
		}
		case userAction.GET_DRIVER.FAIL: {
			return {
				...state,
				driversStatus: 'fail',
			}
		}

		case userAction.GET_PARTNER.REQUEST: {
			return {
				...state,
				partnersStatus: 'request',
				allPartners: {},
			}
		}
		case userAction.GET_PARTNER.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				partnersStatus: 'success',
				allPartners: data,
			}
		}
		case userAction.GET_PARTNER.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				partnersStatus: 'fail',
				partnerGetError: message,
			}
		}

		case userAction.GET_SINGLE_PARTNER.REQUEST: {
			return {
				...state,
				partnersStatus: 'request',
				partnerUpdateErr: {},
				partner: {},
			}
		}
		case userAction.GET_SINGLE_PARTNER.SUCCESS: {
			const {data} = action.payload.data;
			return {
				...state,
				partnersStatus: 'success',
				partner: data,
			}
		}
		case userAction.GET_SINGLE_PARTNER.FAIL: {
			return {
				...state,
				partnersStatus: 'fail',
			}
		}

		case userAction.GET_BRANCHES.REQUEST: {
			return {
				...state,
				branchesStatus: 'request',
			}
		}
		case userAction.GET_BRANCHES.SUCCESS: {
			return {
				...state,
				branchesStatus: 'success',
				branches: action.payload.data.data,
				branchesErr: {},
			}
		}
		case userAction.GET_BRANCHES.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				branchesStatus: 'fail',
				branchesErr: data.message,
			}
		}

		case userAction.CREATE_USER.REQUEST: {
			return {
				...state,
				userCreateStatus: 'request',
			}
		}
		case userAction.CREATE_USER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				userCreateStatus: 'success',
				userCreate: data,
			}
		}
		case userAction.CREATE_USER.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				userCreateStatus: 'fail',
				createError: message,
			}
		}

		case userAction.CREATE_DRIVER.REQUEST: {
			return {
				...state,
				driverCreateStatus: 'request',
			}
		}
		case userAction.CREATE_DRIVER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				driverCreateStatus: 'success',
				driverCreate: data,
			}
		}
		case userAction.CREATE_DRIVER.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				driverCreateStatus: 'fail',
				driverCreateErr: message,
			}
		}

		case userAction.CREATE_PARTNER.REQUEST: {
			return {
				...state,
				partnerCreateStatus: 'request',
			}
		}
		case userAction.CREATE_PARTNER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				partnerCreateStatus: 'success',
				partnerCreate: data,
			}
		}
		case userAction.CREATE_PARTNER.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				partnerCreateStatus: 'fail',
				partnerCreateErr: message,
			}
		}

		case userAction.UPDATE_USER.REQUEST: {
			return {
				...state,
				userUpdateStatus: 'request',
			}
		}
		case userAction.UPDATE_USER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				userUpdateStatus: 'success',
				userUpdate: data,
			}
		}
		case userAction.UPDATE_USER.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				userUpdateStatus: 'fail',
				upError: message,
			}
		}

		case userAction.UPDATE_DRIVER.REQUEST: {
			return {
				...state,
				driverUpdateStatus: 'request',
			}
		}
		case userAction.UPDATE_DRIVER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				driverUpdateStatus: 'success',
				driverUpdate: data,
			}
		}
		case userAction.UPDATE_DRIVER.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				driverUpdateStatus: 'fail',
				driverUpdateErr: message,
			}
		}

		case userAction.UPDATE_PARTNER.REQUEST: {
			return {
				...state,
				partnerUpdateStatus: 'request',
			}
		}
		case userAction.UPDATE_PARTNER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				partnerUpdateStatus: 'success',
				partnerUpdate: data,
			}
		}
		case userAction.UPDATE_PARTNER.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				partnerUpdateStatus: 'fail',
				partnerUpdateErr: message,
			}
		}

		case userAction.DELETE_USER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				userDeleteStatus: 'success',
				userDelete: data,
			}
		}
		case userAction.DELETE_USER.FAIL: {
			return {
				...state,
				userDeleteStatus: 'fail',
			}
		}

		case userAction.DELETE_DRIVER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				driverDeleteStatus: 'success',
				driverDelete: data,
			}
		}
		case userAction.DELETE_DRIVER.FAIL: {
			return {
				...state,
				driverDeleteStatus: 'fail',
			}
		}

		case userAction.DELETE_PARTNER.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				partnerDeleteStatus: 'success',
				partnerDelete: data,
			}
		}
		case userAction.DELETE_PARTNER.FAIL: {
			return {
				...state,
				partnerDeleteStatus: 'fail',
			}
		}

		case userAction.USER_TOKEN_DELETE: {
			Account.delete();
			return {
				...state,
				token: '',
				resetToken: '',
				loginData: {},
				checkStatus: {},
				activeUsers: [],
				activeDrivers: [],
			}
		}

		case userAction.BACK_TO_LOGIN: {
			return {
				...state,
				errors: {},
				checkErrors: {},
				loginData: {},
				checkStatus: {},
			}
		}

		case userAction.DELETE_USER_DATA: {
			return {
				...state,
				userUpdate: {},
				userDelete: {},
				userCreate: {},
				createError: {},
				upError: {},
				driverCreate: {},
				driverUpdate: {},
				driverDelete: {},
				driverCreateErr: {},
				driverUpdateErr: {},
				partnerCreate: {},
				partnerUpdate: {},
				partnerDelete: {},
				partnerCreateErr: {},
				partnerUpdateErr: {},
			}
		}

		default: {
			return state;
		}
	}
}
