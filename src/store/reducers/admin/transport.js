import * as t from "../../actions/admin/transport";

const initialState = {
  allTransports: {},
  transportCreate: {},
  transportUpdate: {},
  transportDelete: {},
  transportsStatus: '',
  transportCreateStatus: '',
  transportUpdateStatus: '',
  transportDeleteStatus: '',
  transportCreateErr: {},
  transportUpdateErr: {},
  transportGetError: {},
  transport: {},
}

export default function reducer(state = initialState, action) {

  switch ( action.type ) {
    case t.GET_TRANSPORTS.REQUEST: {
      return {
        ...state,
        transportsStatus: 'request',
        allTransports: {},
      }
    }
    case t.GET_TRANSPORTS.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        transportsStatus: 'success',
        allTransports: data,
        transportGetError: {},
      }
    }
    case t.GET_TRANSPORTS.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        transportsStatus: 'fail',
        transportGetError: message,
      }
    }

    case t.GET_TRANSPORT.REQUEST: {
      return {
        ...state,
        transportsStatus: 'request',
        transport: {},
        transportUpdateErr: {}
      }
    }
    case t.GET_TRANSPORT.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        transportsStatus: 'success',
        transport: data,
      }
    }
    case t.GET_TRANSPORT.FAIL: {
      return {
        ...state,
        transportsStatus: 'fail',
      }
    }

    case t.CREATE_TRANSPORT.REQUEST: {
      return {
        ...state,
        transportCreateStatus: 'request',
      }
    }
    case t.CREATE_TRANSPORT.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        transportCreateStatus: 'success',
        transportCreate: data,
      }
    }
    case t.CREATE_TRANSPORT.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        transportCreateStatus: 'fail',
        transportCreateErr: message,
      }
    }

    case t.UPDATE_TRANSPORT.REQUEST: {
      return {
        ...state,
        transportUpdateStatus: 'request',
      }
    }
    case t.UPDATE_TRANSPORT.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        transportUpdateStatus: 'success',
        transportUpdate: data,
      }
    }
    case t.UPDATE_TRANSPORT.FAIL: {
      const {message} = action.payload.data;
      return {
        ...state,
        transportUpdateStatus: 'fail',
        transportUpdateErr: message,
      }
    }

    case t.DELETE_TRANSPORT.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        transportDeleteStatus: 'success',
        transportDelete: data,
      }
    }
    case t.DELETE_TRANSPORT.FAIL: {
      return {
        ...state,
        transportDeleteStatus: 'fail',
      }
    }

    case t.DELETE_TRANSPORT_DATA: {
      return {
        ...state,
        transportCreate: {},
        transportUpdate: {},
        transportDelete: {},
        transportCreateErr: {},
        transportUpdateErr: {},
      }
    }

    default: {
      return state;
    }
  }
}
