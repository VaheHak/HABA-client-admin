import * as serviceAction from "../../actions/admin/service";

const initialState = {
  allServices: {},
  allTickets: {},
  serviceCreate: {},
  ticketCreate: {},
  serviceUpdate: {},
  ticketUpdate: {},
  serviceDelete: {},
  ticketDelete: {},
  passengerDelete: {},
  serviceStatus: '',
  ticketStatus: '',
  serviceCreateStatus: '',
  ticketCreateStatus: '',
  serviceUpdateStatus: '',
  ticketUpdateStatus: '',
  serviceDeleteStatus: '',
  ticketDeleteStatus: '',
  ticketGetErr: {},
  ticketCreateErr: {},
  ticketUpdateErr: {},
  serviceGetErr: {},
  serviceCreateErr: {},
  serviceUpdateErr: {},
  service: {},
  ticket: {},
}

export default function reducer(state = initialState, action) {

  switch ( action.type ) {
    case serviceAction.CREATE_SERVICE.REQUEST: {
      return {
        ...state,
        serviceCreateStatus: 'request',
      }
    }
    case serviceAction.CREATE_SERVICE.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        serviceCreateStatus: 'success',
        serviceCreate: data,
        serviceCreateErr: {},
      }
    }
    case serviceAction.CREATE_SERVICE.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        serviceCreateStatus: 'fail',
        serviceCreateErr: message,
      }
    }

    case serviceAction.CREATE_TICKET.REQUEST: {
      return {
        ...state,
        ticketCreateStatus: 'request',
      }
    }
    case serviceAction.CREATE_TICKET.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        ticketCreateStatus: 'success',
        ticketCreate: data,
        ticketCreateErr: {},
      }
    }
    case serviceAction.CREATE_TICKET.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        ticketCreateStatus: 'fail',
        ticketCreateErr: message,
      }
    }

    case serviceAction.GET_SERVICE.REQUEST: {
      return {
        ...state,
        serviceStatus: 'request',
      }
    }
    case serviceAction.GET_SERVICE.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        serviceStatus: 'success',
        allServices: data,
        serviceGetErr: {},
      }
    }
    case serviceAction.GET_SERVICE.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        serviceStatus: 'fail',
        serviceGetErr: message,
      }
    }

    case serviceAction.GET_ONE_SERVICE.REQUEST: {
      return {
        ...state,
        serviceStatus: 'request',
        serviceUpdateErr: {},
      }
    }
    case serviceAction.GET_ONE_SERVICE.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        serviceStatus: 'success',
        service: data,
      }
    }
    case serviceAction.GET_ONE_SERVICE.FAIL: {
      return {
        ...state,
        serviceStatus: 'fail',
      }
    }

    case serviceAction.GET_TICKET.REQUEST: {
      return {
        ...state,
        ticketStatus: 'request',
      }
    }
    case serviceAction.GET_TICKET.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        ticketStatus: 'success',
        allTickets: data,
      }
    }
    case serviceAction.GET_TICKET.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        ticketStatus: 'fail',
        ticketGetErr: message,
      }
    }

    case serviceAction.GET_ONE_TICKET.REQUEST: {
      return {
        ...state,
        ticketStatus: 'request',
        ticketUpdateErr: {},
      }
    }
    case serviceAction.GET_ONE_TICKET.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        ticketStatus: 'success',
        ticket: data,
      }
    }
    case serviceAction.GET_ONE_TICKET.FAIL: {
      return {
        ...state,
        ticketStatus: 'fail',
      }
    }

    case serviceAction.UPDATE_SERVICE.REQUEST: {
      return {
        ...state,
        serviceUpdateStatus: 'request',
      }
    }
    case serviceAction.UPDATE_SERVICE.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        serviceUpdateStatus: 'success',
        serviceUpdate: data,
        serviceUpdateErr: {},
      }
    }
    case serviceAction.UPDATE_SERVICE.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        serviceUpdateStatus: 'fail',
        serviceUpdateErr: message,
      }
    }

    case serviceAction.UPDATE_TICKET.REQUEST: {
      return {
        ...state,
        ticketUpdateStatus: 'request',
      }
    }
    case serviceAction.UPDATE_TICKET.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        ticketUpdateStatus: 'success',
        ticketUpdate: data,
        ticketUpdateErr: {},
      }
    }
    case serviceAction.UPDATE_TICKET.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        ticketUpdateStatus: 'fail',
        ticketUpdateErr: message,
      }
    }

    case serviceAction.DELETE_SERVICE.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        serviceDeleteStatus: 'success',
        serviceDelete: data,
      }
    }
    case serviceAction.DELETE_SERVICE.FAIL: {
      return {
        ...state,
        serviceDeleteStatus: 'fail',
      }
    }

    case serviceAction.DELETE_TICKET.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        ticketDeleteStatus: 'success',
        ticketDelete: data,
      }
    }
    case serviceAction.DELETE_TICKET.FAIL: {
      return {
        ...state,
        ticketDeleteStatus: 'fail',
      }
    }

    case serviceAction.DELETE_PASSENGER.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        ticketDeleteStatus: 'success',
        passengerDelete: data,
      }
    }
    case serviceAction.DELETE_PASSENGER.FAIL: {
      return {
        ...state,
        ticketDeleteStatus: 'fail',
      }
    }

    case serviceAction.DELETE_SERVICE_DATA: {
      return {
        ...state,
        ticketCreate: {},
        ticketUpdate: {},
        ticketDelete: {},
        ticketCreateErr: {},
        ticketUpdateErr: {},
        serviceCreate: {},
        serviceUpdate: {},
        serviceDelete: {},
        serviceCreateErr: {},
        serviceUpdateErr: {},
        passengerDelete: {},
      }
    }

    default: {
      return state;
    }
  }
}
